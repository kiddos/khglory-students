$(document).ready(function() {
  // swap between basic info form and extra info form
  function switchPage() {
    if ($('#next').val() === '確定輸入') {
      $('#next').val('下一步');
    } else {
      $('#next').val('確定輸入');
    }
    $('#previous').attr('disabled', !$('#previous').attr('disabled'));

    $('.student-form').each(function() {
      if ($(this).hasClass('hide')) {
        $(this).removeClass('hide');
      } else {
        $(this).addClass('hide');
      }
    });
  }

  function submitData() {
    var student = {};
    $('input.field-inputs').each(function() {
      // ignore small fields like birthday to be parsed later
      if (!$(this).hasClass('small')) {
        if ($(this).val() !== '' && !$(this).attr('disabled')) {
          student[$(this).attr('name')] = $(this).val();
        }
      }
    });

    // parse option fields
    $('input.field-options').each(function() {
      if ($(this).prop('checked')) {
        if ($(this).val() === '其他') {
          var $otherInput = $('input.field-inputs[name="' +
            $(this).attr('name') + '"]');
          if ($otherInput.val() !== '') {
            student[$(this).attr('name')] = $otherInput.val();
          }
        } else {
          student[$(this).attr('name')] = $(this).val();
        }
      }
    });

    // parse birthday
    if ($('input.field-inputs[name="year"]').val() !== '' &&
        $('input.field-inputs[name="month"]').val() !== '' &&
        $('input.field-inputs[name="day"]').val() !== '') {
      student.birthday = new Date($('input.field-inputs[name="year"]').val() +
        '-' + $('input.field-inputs[name="month"]').val() +
        '-' + $('input.field-inputs[name="day"]').val()).toString();
    }

    // check id exist
    if (student.id && student.name) {
      $.ajax({
        url: '/students/add',
        method: 'POST',
        data: student,
      }).done(function(data) {
        if (data !== 'success') {
          alert('加入資料失敗');
        }
      });
    }
    console.log(student);
  }

  $('#next').on('click', function() {
    var swap = true;
    if ($(this).val() === '確定輸入') {
      submitData();
    } else if ($(this).val() === '下一步') {
      $('input.field-inputs').each(function() {
        var $label = $(this).prev();
        if ($label.has('span.require-text').length && $(this).val() === '') {
          swap = false;
          $label.children('span.error').text('此欄位必須輸入');
        }
      });
      $('input.field-inputs[name="student-name"]').val(
        $('input.field-inputs[name="name"]').val());
    }

    if (swap) switchPage();
  });

  $('#previous').on('click', function() {
    if (!$(this).attr('disabled')) {
      switchPage();
    }
  });
});