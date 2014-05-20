var ESCAPE_KEY = 27;

function showTargetLineLength(event) {
  var target = event.target;
  console.log($(target).width() + 'px');

  var html = $(target).html();
  var markedHtml = html.replace(/(\S+)/g, '<span>$1</span>');
  $(target).html(markedHtml);
}

var listeningForMousemove = false;
chrome.runtime.onMessage.addListener(function (message) {
  if (!listeningForMousemove && message.active) {
    $(document).on('mousemove', showTargetLineLength);
    listeningForMousemove = true;
  } else {
    $(document).off('mousemove', showTargetLineLength);
    listeningForMousemove = false;
  }
});

$(document).on('keydown', function (event) {
  if (event.which === ESCAPE_KEY) {
    chrome.runtime.sendMessage({ active: false });
  }
});
