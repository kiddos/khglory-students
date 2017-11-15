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
    $row.find('td').each(function() {
      var key = $(this).attr('class').substring(5);
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
        alert('編輯失敗');
      }
    });
  });

  // delete button
  $('input.delete').on('click', function() {
    var $row = $(this).closest('tr');
    var teacher = collectData($row);

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

  // cancel button
  $('input.cancel').on('click', function() {
    var $row = $(this).closest('tr');
    toggleRow($row);
  });
});
