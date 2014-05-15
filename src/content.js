function showTargetLineLength(event) {
  var target = event.target;
  console.log($(target).width() + 'px');
}

$(document).on('mousemove', showTargetLineLength);
