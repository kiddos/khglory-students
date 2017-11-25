$(document).ready(function() {
  // total 3 phase
  // 1: insert class with name and start date
  // 2: assign teacher for this class
  // 3: add students for this class
  var phase = 0;

  // stored to submit
  var teachers = [];
  var students = [];

  function changeButton() {
    if (phase === 0) {
      $('#previous').removeClass('hide').prop('disabled', true);
    }
    if (phase > 0) {
      $('#previous').prop('disabled', false);
    }
    if (phase === 2) {
      $('#next').addClass('hide');
      $('#confirm').removeClass('hide');
    } else {
      $('#next').removeClass('hide');
      $('#confirm').addClass('hide');
    }
  }

  function changeView() {
    for (var p = 0; p < 3 ; ++p) {
      if (p === phase) {
        $('#phase' + (p + 1)).removeClass('hide');
      } else {
        $('#phase' + (p + 1)).addClass('hide');
      }
    }
  }

  $('#previous').on('click', function() {
    if (phase > 0) phase -= 1;
    changeButton();
    changeView();
  });

  $('#next').on('click', function() {
    var advance = function() {
      if (phase < 2) phase += 1;
      changeButton();
      changeView();
    };

    if (phase === 0) {
      if ($('input.field-inputs[name="name"]').val() === '') {
        $('.error').text('課程名稱必填');
      } else {
        advance();
      }
    } else if (phase === 1) {
      teachers = [];
      $('#phase2').find('input[type="checkbox"]').each(function() {
        var $row = $(this).closest('tr');
        if ($row.find('input[type="checkbox"]').prop('checked')) {
          teachers.push({
            id: $row.find('td.info-id').text(),
            name: $row.find('td.info-name').text(),
          });
        }
      });
      if (teachers.length > 0) {
        advance();
      } else {
        errorMessage('課程需要老師', 1000);
      }
    }
  });

  $('#confirm').on('click', function() {
    $('#phase3').find('input[type="checkbox"]').each(function() {
      var $row = $(this).closest('tr');
      if ($row.find('input[type="checkbox"]').prop('checked')) {
        students.push({
          id: $row.find('td.info-id').text(),
          name: $row.find('td.info-name').text(),
        });
      }
    });

    var data = JSON.stringify({
      name: $('input[name="name"]').val(),
      startDate: $('input[name="startDate"]').val(),
      teachers: teachers,
      students: students,
    });
    $.ajax({
      url: '/classes/add',
      type: 'POST',
      data: {
        data: data
      }
    }).done(function(data) {
      if (data === 'success') {
        phase = 0;
        changeButton();
        changeView();
        // empty inputs
        $('input.field-inputs').val('');
        infoMessage('加入課程成功', 1000);
      } else {
        errorMessage('加入課程失敗, 請稍後再試', 1000);
      }
    });
  });
});
