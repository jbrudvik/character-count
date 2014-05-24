var ESCAPE_KEY = 27;

var events = [
  'mousemove',
  'mouseup',
  'keydown',
  'keyup'
];

var popup;

function createPopup() {
  var iframe = $('<iframe>');
  iframe.css({
    'position': 'absolute',
    'left': '0px',
    'top': '0px',
    'width': '50px',
    'height': '50px',
    'margin': '0',
    'padding': '0',
    'border': 'none',
    'background-color': '#eee',
    'color': '#333',
    'display': 'none'
  });
  return iframe;
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
        console.log(text.length + ' characters in: ' + text);

        popup.contents().find('body').html('<p>' + text.length + '</p>');
        popup.css('display', 'block');

        prevCharCount = charCount;
        prevText = text;
        prevX = x;
        prevY = y;
      }
    } else {
      popup.css('display', 'none');
    }
  } else {
    popup.css('display', 'none');
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
