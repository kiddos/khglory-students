$(document).ready(function() {
  $('.main-content').css('max-width', '1280px');
  $('.main-content').css('max-height', '700px');

  function toggleRow($row) {
    $row.find('.edit-field').each(function() {
      $(this).prop('disabled', !$(this).prop('disabled'));
    });

    // find the edit buttons for that row
    // and hide it if not hidden,
    // unhide it if hidden
    var $edit = $row.find('.info-edit input');
    $edit.each(function() {
      if ($(this).hasClass('hide')) {
        $(this).removeClass('hide');
      } else {
        $(this).addClass('hide');
      }
    });
  }

  // edit button
  $('input.edit').on('click', function() {
    var $row = $(this).closest('tr');
    toggleRow($row);
  });

  function collectData($row) {
    var teacher = {};
    console.log($row);
    $row.find('td').each(function() {
      var key = $(this).attr('class').substring(5);
      console.log(key);
      if (key === 'edit') return;
      if (key === 'id') {
        teacher[key] = $(this).text();
      } else {
        var val = $(this).children('input.edit-field').val();
        teacher[key] = val;
      }
    });
    return teacher;
  }

  // confirm button
  $('input.confirm').on('click',function() {
    var $row = $(this).closest('tr');
    var teacher = collectData($row);

    $.ajax({
      url: '/teachers/edit',
      type: 'POST',
      data: teacher,
    }).done(function(data) {
      if (data !== 'success') {
        errorMessage('編輯資料失敗', 1000);
      } else {
        infoMessage('編輯成功', 1000);
      }
    });
  });

  // delete button
  $('input.delete').on('click', function() {
    var $row = $(this).closest('tr');
    popupMessage('刪除', '確定要刪除資料嗎？', function() {
      var teacher = collectData($row);

      console.log(teacher);

      $.ajax({
        url: '/teachers/delete',
        type: 'POST',
        data: teacher,
      }).done(function(data) {
        if (data !== 'success') {
          errorMessage('刪除資料失敗', 1000);
        } else {
          infoMessage('刪除成功', 1000);
          $row.fadeOut();
        }
      });
    });
  });

  // cancel button
  $('input.cancel').on('click', function() {
    var $row = $(this).closest('tr');
    toggleRow($row);
  });
});
