function showTargetLineLength(event) {
  var target = event.target;
  console.log($(target).width() + 'px');
}

chrome.runtime.onMessage.addListener(function (message) {
  if (message.active) {
    $(document).on('mousemove', showTargetLineLength);
  } else {
    $(document).off('mousemove', showTargetLineLength);
  }
});
