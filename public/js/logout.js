$(document).ready(function() {
  $('#logout').on('click', function() {
    popupMessage('登出', '您確定要登出嗎？', function() {
      $.post('/logout').done(function(msg) {
        window.location.href = '/';
      }).fail(function(xhr, status, err) {
        window.location.href = '/';
      });
    });
  });
});
