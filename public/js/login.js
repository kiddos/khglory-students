$(document).ready(function() {
  $('#submit').on('click', function() {
    $.ajax({
      url: '/login',
      method: 'POST',
      data: {
        username: $('#username').val(),
        password: $('#password').val(),
      },
    }).done(function(status) {
      if (status === 'success') {
        window.location.href = '/';
      } else {
        errorMessage('登入失敗', 600);
      }
    });
  });
});

$(window).on('keypress', function(event) {
  if (event.key === 'Enter') {
    $('#submit').click();
  }
});
