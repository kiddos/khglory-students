$(document).ready(function() {
  $('.main-content').css('max-width', '1280px');
  $('.main-content').css('max-height', '700px');

  $('input.edit').on('click', function() {
    $('input.edit').addClass('hide');
    $('input.confirm').removeClass('hide');
    $('input.cancel').removeClass('hide');
    $('input.delete').removeClass('hide');
  });

  function collectData($row) {
    var teacher = {};
    $('td').each(function() {
      var key = $(this).attr('class').substring(5);
      if (key === 'edit') return;
      var val = $(this).children('input.edit-field').val();
      teacher[key] = val;
    });
    return teacher;
  }

  $('input.confirm').on('click',function() {
    var $row = $(this).parent().parent();
    var teacher = collectData($row);

    $.ajax({
      url: '/teachers/edit',
      type: 'POST',
      data: teacher,
    }).done(function(data) {
      if (data !== 'success') {
        alert('編輯失敗');
      }
    });
  });

  $('input.delete').on('click', function() {
    var $row = $(this).parent().parent();
    var teacher = collectData($row);

    console.log(teacher);
    $.ajax({
      url: '/teachers/delete',
      type: 'POST',
      data: teacher,
    }).done(function(data) {
      if (data !== 'success') {
        alert('刪除失敗');
      }
      $row.fadeOut();
    });
  });

  $('input.cancel').on('click', function() {
    $('input.edit').removeClass('hide');
    $('input.confirm').addClass('hide');
    $('input.cancel').addClass('hide');
    $('input.delete').addClass('hide');
  });
});
