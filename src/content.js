var ESCAPE_KEY = 27;
var TARGET = 'line-length-target';
var WORD = 'line-length-word';

function showTargetLineLength(event) {
  var target = event.target;
  // console.log($(target).width() + 'px');

  if (!$(target).hasClass(TARGET)) {
    var html = $(target).html();
    var markedHtml = html.replace(/(\S+)/g, '<span class="' + WORD + '">$1</span>');
    markedHtml = '<span class="' + TARGET + '">' + markedHtml + '</span>';

    $(target).html(markedHtml);

    var $spannedWords = $(target).find('span');
    var wordsByHeight = _.groupBy($spannedWords, function (word) {
      return $(word).offset().top;
    });

    console.log(_.keys(wordsByHeight));

    $(target).html(html);
  }
}

var listeningForMousemove = false;
chrome.runtime.onMessage.addListener(function (message) {
  var shouldAttachListener = !listeningForMousemove && message.active;
  if (shouldAttachListener) {
    $(document.body).on('mousemove', showTargetLineLength);
  } else {
    $(document.body).off('mousemove', showTargetLineLength);
  }
  listeningForMousemove = shouldAttachListener;
});

$(document).on('keydown', function (event) {
  if (event.which === ESCAPE_KEY) {
    chrome.runtime.sendMessage({ active: false });
  }
});
