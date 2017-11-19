$(document).ready(function() {
  function toggleEditText($row) {
    $row.find('input[type="text"]').each(function() {
      $(this).prop('disabled', !$(this).prop('disabled'));
    });
  }

  $('input[type="button"].edit').on('click', function() {
    var $row = $(this).closest('tr');
    $row.find('input[type="button"].edit').addClass('hide');
    $row.find('input[type="button"].delete').removeClass('hide');
    $row.find('input[type="button"].confirm').removeClass('hide');
    $row.find('input[type="button"].cancel').removeClass('hide');
    toggleEditText($row);
  });

  $('input[type="button"].delete').on('click', function() {
    var $row = $(this).closest('tr');
    var classId = $row.find('td.info-id').text();
    var className = $row.find('td.info-name').text();
    var startDate = $row.find('td.info-startDate').text();

    $.ajax({
      url: '/classes/delete',
      method: 'POST',
      data: {
        id: classId,
        name: className,
        startDate: startDate,
      }
    }).done(function(response) {
      if (response === 'success') {
        $row.fadeOut();
      }
    });
  });

  function togglePanelSize() {
    if ($('.main-content').css('max-width') === '600px') {
      $('.main-content').css('max-width', '1024px');
    } else if ($('.main-content').css('max-width') === '1024px') {
      $('.main-content').css('max-width', '600px');
    }

    if ($('.main-content').css('max-height') === '500px') {
      $('.main-content').css('max-height', '700px');
    } else if ($('.main-content').css('max-height') === '700px') {
      $('.main-content').css('max-height', '500px');
    }
  }

  function toggleButtonPanel() {
    $('.info-button-panel').find('input[type="button"].button').each(function() {
      if ($(this).hasClass('hide')) {
        $(this).removeClass('hide');
      } else {
        $(this).addClass('hide');
      }
    });
  }

  function toggleLists() {
    $('.info-list').each(function() {
      if ($(this).hasClass('hide')) {
        $(this).removeClass('hide');
      } else {
        $(this).addClass('hide');
      }
    });
  }

  $('input[type="button"].confirm').on('click', function() {
    toggleLists();
    toggleButtonPanel();
    togglePanelSize();

    var classId = $(this).closest('tr').find('td.info-id').text();

    // fetch all students and teachers to display
    $.ajax({
      url: '/classes/edit/' + classId,
      method: 'GET',
      contentType: 'application/json',
    }).done(function(data) {
      var obj = JSON.parse(data);
      var teachers = obj.teachers;
      var students = obj.students;

      var $studentTable = $('#students');
      var $studentHeader = $studentTable.find('tbody tr:first-child');
      $studentTable.find('tr').each(function() {
        $(this).find('td.info-edit input[type="checkbox"]').prop(
          'checked', false);
        for (var i = 0; i < students.length; ++i) {
          if ($(this).find('td.info-id').text() === students[i].id) {
            $(this).find('td.info-edit input[type="checkbox"]').prop(
              'checked', true);
            $(this).insertAfter($studentHeader);
          }
        }
      });

      var $teacherTable = $('#teachers');
      var $teacherHeader = $teacherTable.find('tbody tr:first-child');
      $teacherTable.find('tr').each(function() {
        for (var i = 0; i < teachers.length; ++i) {
          $(this).find('td.info-edit input[type="checkbox"]').prop(
            'checked', false);
          if ($(this).find('td.info-id').text() == teachers[i].id) {
            $(this).find('td.info-edit input[type="checkbox"]').prop(
              'checked', true);
            $(this).insertAfter($teacherHeader);
          }
        }
      });
    });
  });

  $('input[type="button"].cancel').on('click', function() {
    var $row = $(this).closest('tr');
    $row.find('input[type="button"].edit').removeClass('hide');
    $row.find('input[type="button"].delete').addClass('hide');
    $row.find('input[type="button"].confirm').addClass('hide');
    $row.find('input[type="button"].cancel').addClass('hide');
    toggleEditText($row);
  });

  $('#previous').on('click', function() {
    toggleLists();
    toggleButtonPanel();
    togglePanelSize();
  });

  $('#confirm').on('click', function() {
  });
});
