/*
 * Character Count content script
 */


/*
 * Constants
 */
var ESCAPE_KEY = 27;
var SELECTION_CHANGE_EVENT = 'selectionChange';


/*
 * Creates and controls an element that displays character count information
 */
function CharacterCountPopup() {
  this.ID = 'character-count-popup';
  this.popup = $('<div id="' + this.ID + '">').css({
    'position': 'fixed',
    'z-index': 2147483647,
    'top': 0,
    'right': 0,
    'width': 'auto',
    'height': 'auto',
    'margin': 0,
    'padding': '6px',
    'border': 'none',
    'outline': 'none',
    'box-shadow': 'none',
    'background-color': 'rgba(255, 255, 255, 0.8)',
    'color': '#333',
    'font-family': 'Menlo, Consolas, "Liberation Mono", monospace',
    'font-size': '14px',
    'line-height': 1,
    'text-decoration': 'none',
    'vertical-align': 'baseline',
    'user-select': 'none',
    'pointer-events': 'none'
  })[0];
}

/*
 * Return message for given count (required)
 */
CharacterCountPopup.prototype.getMessageForCount = function (count) {
  return count + ' character' + (count === 1 ? '' : 's') + ' selected';
};

/*
 * Display character count popup with given count (default: 0)
 */
CharacterCountPopup.prototype.show = function (count) {
  var message = this.getMessageForCount(count || 0);
  $(this.popup).html(message);
  document.body.appendChild(this.popup);
};

/*
 * Hide character count popup
 */
CharacterCountPopup.prototype.hide = function () {
  var parent = this.popup.parentNode;
  if (parent) {
    parent.removeChild(this.popup);
  }
};


/*
 * An object for observing and comparing current text selections.
 *
 * When instantiated, captures the current selection and computes a count
 * of characters selected.
 *
 * May be compared for equality against other EquatableSelection instances.
 *
 * Should be treated as immutable.
 */
function EquatableSelection() {
  var selection = window.getSelection();
  if (selection && selection.rangeCount === 1) {
    this.text = selection.toString();
    this.count = this._computeCount(selection);
  }
}

/*
 * (Private) Compute the number of characters in a EquatableSelection
 */
EquatableSelection.prototype._computeCount = function (selection) {
  var text = selection.toString();

  if (!text || !text.length) {
    return 0;
  }

  // Consider a groups of newline whitespace to be one space each
  var countWithCompressedNewlines = text.replace(/[\n\r]+/g, ' ').length;

  var anchorNode = selection.anchorNode; // node containing start of selection
  var focusNode = selection.focusNode; // node containing end of selection

  // If focus node is a text node, considerly slightly more accurate counting approaches
  if (focusNode.nodeType == Node.TEXT_NODE) {

    // If the anchor node and the focus node are the same, the count of characters
    // selected is the absolute difference of the anchor and focus offsets
    if (anchorNode === focusNode) {
      return Math.abs(selection.focusOffset - selection.anchorOffset);
    }

    // If focus node follows anchor node, selection.toString() sometimes includes
    // trailing whitespace even if it isn't selected. Decrease count by one if there
    // is a discrepancy with focusOffset.
    if (anchorNode.compareDocumentPosition(focusNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
      if (focusNode.data[selection.focusOffset - 1] !== text[text.length - 1]) {
        return countWithCompressedNewlines - 1;
      }
    }

    // If focus node trails anchor node, selection.toString() sometimes fails
    // to include leading whitespace, even if it selected. Increase count by
    // one if there is a discrepancy with focusOffset.
    if (focusNode.compareDocumentPosition(anchorNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
      var leadingCharacter = focusNode.data[selection.focusOffset];
      if (leadingCharacter && leadingCharacter !== text[0] && leadingCharacter === ' ') {
          return countWithCompressedNewlines + 1;
      }
    }
  }

  return countWithCompressedNewlines;
};

/*
 * Return true if two EquatableSelection objects are equal, false otherwise
 */
EquatableSelection.prototype.isEqual = function (other) {
  return other &&
    this.count === other.count &&
    this.text === other.text;
};


/*
 * An object that listens for selection changes on a target object and triggers
 * a custom jQuery 'selectionChange' event when changes are observed.
 *
 * Observes changes using EquatableSelection.
 *
 * Triggered selectionChange events contain a `selection` property containing an
 * EquatableSelection if a selection exists. In the case of a previously-selected
 * selection being unselected, the triggered selectionChange event will not contain
 * a `selection` property.
 */
function SelectionListener(target) {
  this.target = target;

  // An internal event used to force extra selection change checks
  this.SELECTION_CHANGE_IMMINENT_EVENT = 'selectionChangeImminent';

  // Events which may indicate selection changes
  this.events = [
    'mousemove',
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
    'scroll',
    this.SELECTION_CHANGE_IMMINENT_EVENT
  ];

  this.isListening = false;
}

/*
 * Handle events and check for selection changes.
 *
 * Trigger selectionChange event if a selection change has occurred.
 */
SelectionListener.prototype.handleEvent = function (event) {
  var current = new EquatableSelection();

  if (current && current.count) {
    if (!current.isEqual(this.previous)) {
      // Trigger a selectionChange event if this selection is not equal to
      // the previously-observed selection
      $(this.target).trigger({
        type: SELECTION_CHANGE_EVENT,
        selection: current
      });
      this.previous = current;
    }
  } else if (this.previous) {
    // Trigger empty event to signify that a selection has been "unselected"
    $(this.target).trigger(SELECTION_CHANGE_EVENT);
    this.previous = null;
  }

  // Mouse clicks can cause selections to change, but the selection change
  // might not have completed yet. Check again shortly.
  if (event && (event.type === 'mousedown' || event.type === 'mouseup')) {
    var self = this;
    setTimeout(function () {
      $(self.target).trigger(self.SELECTION_CHANGE_IMMINENT_EVENT);
    }, 20);
  }
};

/*
 * Start listening for selection changes.
 *
 * If there is an existing selection when this method is called, a
 * selectionChange event will be immediately triggered.
 */
SelectionListener.prototype.start = function () {
  if (!this.isListening) {
    _.each(this.events, function (event) {
      $(this.target).on(event, this.handleEvent.bind(this));
    }, this);
    this.isListening = true;

    // Check for existing seletion immediately
    $(this.target).trigger(this.SELECTION_CHANGE_IMMINENT_EVENT);
  }
};

/*
 * Stop listening for selection changes.
 *
 * One empty selectionChange event is immediately triggered.
 */
SelectionListener.prototype.stop = function () {
  if (this.isListening) {
    $(this.target).trigger(SELECTION_CHANGE_EVENT);
    this.previous = null;

    _.each(this.events, function (event) {
      $(this.target).off(event);
    }, this);
    this.isListening = false;
  }
};


/*
 * Instantiate popup and and listeners
 */
var target = window;
var popup = new CharacterCountPopup();
var selectionListener = new SelectionListener(target);

// Listen for selection changes and show/hide the popup based on the number of
// characters selected
$(target).on(SELECTION_CHANGE_EVENT, function (event) {
  if (event.selection) {
    popup.show(event.selection.count);
  } else {
    popup.hide();
  }
});

// Listen for messages from other parts of the extension to start/stop selection listening
chrome.runtime.onMessage.addListener(function (message) {
  if (message.active) {
    selectionListener.start();
  } else {
    selectionListener.stop();
  }
});

// When escape key is down, disable the extension
$(document).on('keydown', function (event) {
  if (event.which === ESCAPE_KEY) {
    chrome.runtime.sendMessage({ active: false });
  }
});
