function infoMessage(message, time) {
  if ($('#message-text').hasClass('error')) {
    $('#message-text').removeClass('error');
  }

  $('#message-text').addClass('success').text(message);
  $('.message-dialog').removeClass('transparent');

  setTimeout(function() {
    $('.message-dialog').addClass('transparent');
  }, time + 1000);
}

function errorMessage(message, time) {
  if ($('#message-text').hasClass('success')) {
    $('#message-text').removeClass('success');
  }

  $('#message-text').addClass('error').text(message);
  $('.message-dialog').removeClass('transparent');

  setTimeout(function() {
    $('.message-dialog').addClass('transparent');
  }, time + 1000);
}
