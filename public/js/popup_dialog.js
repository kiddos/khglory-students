function popupMessage(title, message, yesCallback, noCallback) {
  $('#popup-title').text(title);
  $('#popup-text').text(message);
  $('#popup-dialog').fadeIn();

  $('#yes').on('click', function() {
    $('#popup-dialog').fadeOut(100);
    if (yesCallback) yesCallback();
  });

  $('#no').on('click', function() {
    $('#popup-dialog').fadeOut();
    if (noCallback) noCallback();
  });
}
