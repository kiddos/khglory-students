$(document).ready(function() {
  // adjust main content width and height
  $('.main-content').css('max-width', '1280px');
  $('.main-content').css('max-height', '700px');


  $('.edit').on('click', function() {
    var $row = $(this).closest('tr');
    $row.find('.edit-field').prop('disabled', false);
    $row.find('.confirm').removeClass('hide');
    $row.find('.cancel').removeClass('hide');
    $(this).addClass('hide');
  });

  $('.cancel').on('click', function() {
    var $row = $(this).closest('tr');
    $row.find('.edit-field').prop('disabled', true);
    $row.find('.edit').removeClass('hide');
    $row.find('.confirm').addClass('hide');
    $(this).addClass('hide');
  });

  $('.confirm').on('click', function() {
    var $row = $(this).closest('tr');
    var student = {};
    $row.find('td').each(function() {
      var key = $(this).attr('class').substr(8);
      if (key === 'id' || key === 'edit') return;
      var val = $(this).find('input.edit-field').val();
      student[key] = val;
    });
    student.id = $row.find('td.student-id').text();
    $.ajax({
      url: '/students/edit',
      type: 'POST',
      data: student,
    }).done(function(data) {
      if (data !== 'success') {
        alert('編輯失敗');
      }
      $row.find('.edit-field').prop('disabled', true);
      $row.find('.edit').removeClass('hide');
      $row.find('.cancel').addClass('hide');
      $row.find('.confirm').addClass('hide');
    });
  });
});
