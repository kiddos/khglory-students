var popupMessageCallbacks = [];

function popupMessage(title, message, yesCallback, noCallback) {
  $('#popup-title').text(title);
  $('#popup-text').text(message);
  $('#popup-dialog').fadeIn();

  popupMessageCallbacks.push({
    title: title,
    message: message,
    yes: yesCallback,
    no: noCallback,
  });

  $('#yes').on('click', function() {
    $('#popup-dialog').fadeOut(100);
    for (var i = 0; i < popupMessageCallbacks.length; ++i) {
      if ($('#popup-title').text() === popupMessageCallbacks[i].title &&
          $('#popup-text').text() === popupMessageCallbacks[i].message) {
        yesCallback = popupMessageCallbacks[i].yes;
        if (yesCallback) yesCallback();
        break;
      }
    }
  });

  $('#no').on('click', function() {
    $('#popup-dialog').fadeOut();
    for (var i = 0; i < popupMessageCallbacks.length; ++i) {
      if ($('#popup-title').text() === popupMessageCallbacks[i].title &&
          $('#popup-text').text() === popupMessageCallbacks[i].message) {
        noCallback = popupMessageCallbacks[i].no;
        if (noCallback) noCallback();
        break;
      }
    }
  });
}
