$(document).ready(function() {
  $('#submit').on('click', function() {
    if ($('#re-password').val() === $('#password').val()) {
      $.ajax({
        url: '/admin',
        method: 'POST',
        data: {
          username: $('#username').val(),
          password: $('#password').val(),
        }
      }).done(function(status) {
        if (status === 'success') {
          $('#admin a').text($('#username').val());
          infoMessage('更改成功', 600);
        } else {
          errorMessage('更改失敗', 600);
        }
      });
    } else {
      errorMessage('更改失敗, 密碼輸入錯誤', 600);
    }
  });
});

$(window).on('keypress', function(event) {
  if (event.key === 'Enter') {
    $('#submit').click();
  }
});
