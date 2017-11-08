$(document).ready(function() {
  $('#logout').on('click', function() {
    $('#popup-title').text('登出');
    $('#popup-text').text('您確定要登出嗎？');
    $('#popup-dialog').fadeIn(function() {
      $('#yes').on('click', function() {
        $.post('/login/logout', function() {
          window.location.href = '/';
        });
      });

      $('#no').on('click', function() {
        $('#popup-dialog').fadeOut();
      });
    });
  });
});
