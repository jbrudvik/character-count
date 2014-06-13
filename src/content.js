var ESCAPE_KEY = 27;

var events = [
  'mousemove',
  'mouseup',
  'keydown',
  'keyup'
];

var popup;

function createPopup() {
  var popup = $('<div id="popup">');
  popup.css({
    'position': 'fixed',
    'top': 0,
    'right': 0,
    'width': 'auto',
    'height': 'auto',
    'margin': 0,
    'padding': '6px',
    'border': 'none',
    'background-color': 'rgba(255, 255, 255, 0.8)',
    'color': '#333',
    'font-family': 'Menlo, Consolas, "Liberation Mono", monospace',
    'font-size': '14px',
    'display': 'none'
  });
  return popup;
}

function showPopup(popup, content) {
  popup.html(content);
  popup.css('display', 'block');
}

function hidePopup(popup) {
  popup.css('display', 'none');
}

var prevCharCount;
var prevText;
var prevX;
var prevY;

function showSelectionCharCount(event) {
  var selection = window.getSelection();
  if (selection) {
    var text = selection.toString();
    if (text && text.length) {
      var charCount = text.length;

      var rect = selection.getRangeAt(0).getBoundingClientRect();
      var x = rect.left;
      var y = rect.top;

      if (charCount !== prevCharCount || text !== prevText || x !== prevX || y !== prevY) {
        showPopup(popup, text.length + ' characters selected');

        prevCharCount = charCount;
        prevText = text;
        prevX = x;
        prevY = y;
      }
    } else {
      hidePopup(popup);
    }
  } else {
    hidePopup(popup);
  }
}

var listeningToMouse = false;
chrome.runtime.onMessage.addListener(function (message) {
  var shouldAttachListener = !listeningToMouse && message.active;
  if (shouldAttachListener) {
    _.each(events, function (event) {
      $(document.body).on(event, showSelectionCharCount);
    });
  } else {
    _.each(events, function (event) {
      $(document.body).off(event, showSelectionCharCount);
    });
  }
  listeningToMouse = shouldAttachListener;
});

popup = createPopup();
document.body.appendChild(popup[0]);

$(document).on('keydown', function (event) {
  if (event.which === ESCAPE_KEY) {
    chrome.runtime.sendMessage({ active: false });
  }
});
