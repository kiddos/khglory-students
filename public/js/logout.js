$(document).ready(function() {
  $('#logout').on('click', function() {
    $('#popup-title').text('登出');
    $('#popup-text').text('您確定要登出嗎？');
    $('#popup-dialog').fadeIn();
  });

  $('#yes').on('click', function() {
    $.post('/logout').done(function(msg) {
      window.location.href = '/';
    }).fail(function(xhr, status, err) {
      window.location.href = '/';
    });
  });

  $('#no').on('click', function() {
    $('#popup-dialog').fadeOut();
  });
});
