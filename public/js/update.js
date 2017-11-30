$(document).ready(function() {
  $('#update').on('click', function() {
    $.get('/update', function(status) {
      if (status === 'success') {
        infoMessage('更新成功', 1000);
      } else {
        errorMessage('更新失敗', 1000);
      }
    });
  });
});
