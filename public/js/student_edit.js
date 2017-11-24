$(document).ready(function() {
  $('.edit').on('click', function() {
    var $row = $(this).closest('tr');
    $row.find('.edit-field').prop('disabled', false);
    $row.find('.confirm').removeClass('hide');
    $row.find('.delete').removeClass('hide');
    $row.find('.cancel').removeClass('hide');
    $(this).addClass('hide');
  });

  $('.cancel').on('click', function() {
    var $row = $(this).closest('tr');
    $row.find('.edit-field').prop('disabled', true);
    $row.find('.edit').removeClass('hide');
    $row.find('.confirm').addClass('hide');
    $row.find('.delete').addClass('hide');
    $(this).addClass('hide');
  });

  $('.confirm').on('click', function() {
    var $row = $(this).closest('tr');
    var student = {};
    $row.find('td').each(function() {
      var key = $(this).attr('class').substr(5);
      if (key === 'id' || key === 'edit') return;
      var val = $(this).find('input.edit-field').val();
      student[key] = val;
    });
    student.id = $row.find('td.info-id').text();

    $.ajax({
      url: '/students/edit',
      type: 'POST',
      data: student,
    }).done(function(data) {
      if (data !== 'success') {
        errorMessage('編輯資料失敗, 請稍後再試', 1000);
      } else {
        infoMessage('編輯成功', 1000);
      }
      $row.find('.edit-field').prop('disabled', true);
      $row.find('.edit').removeClass('hide');
      $row.find('.cancel').addClass('hide');
      $row.find('.confirm').addClass('hide');
      $row.find('.delete').addClass('hide');
    });
  });

  $('.delete').on('click', function() {
    popupMessage('刪除', '您確定要刪除嗎？', function() {
      var $row = $(this).closest('tr');
      var student = {};
      student.name = $row.find('td.info-name input.edit-field').val();
      student.id = $row.find('td.info-id').text();

      $.ajax({
        url: '/students/delete',
        type: 'POST',
        data: student
      }).done(function(data) {
        if (data !== 'success') {
          errorMessage('刪除資料失敗, 請稍後再試', 1000);
        } else {
          infoMessage('刪除成功', 1000);
          $row.fadeOut();
        }
      });
    });
  });
});
