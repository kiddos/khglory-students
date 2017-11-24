$(document).ready(function() {
  function submitData() {
    var teacher = {};
    $('input.field-inputs').each(function() {
      // ignore small fields like birthday to be parsed later
      if (!$(this).hasClass('small')) {
        if ($(this).val() !== '' && !$(this).attr('disabled')) {
          teacher[$(this).attr('name')] = $(this).val();
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
            teacher[$(this).attr('name')] = $otherInput.val();
          }
        } else {
          teacher[$(this).attr('name')] = $(this).val();
        }
      }
    });

    // parse birthday
    if ($('input.field-inputs[name="year"]').val() !== '' &&
        $('input.field-inputs[name="month"]').val() !== '' &&
        $('input.field-inputs[name="day"]').val() !== '') {
      teacher.birthday = new Date($('input.field-inputs[name="year"]').val() +
        '-' + $('input.field-inputs[name="month"]').val() +
        '-' + $('input.field-inputs[name="day"]').val()).toString();
    }

    $.ajax({
      url: '/teachers/add',
      method: 'POST',
      data: teacher,
    }).done(function(data) {
      if (data !== 'success') {
        errorMessage('加入資料失敗, 請稍後再試', 1000);
      } else {
        $('input.field-inputs').val('');
        infoMessage('加入成功', 1000);
      }
    });
  }

  $('#confirm').on('click', function() {
    var submit = true;
    // check required field is filled
    $('input.field-inputs').each(function() {
      if ($(this).prev().has('span.require-text').length &&
          $(this).val() === '') {
        submit = false;
        $(this).prev().children('span.error').text('此欄位必須輸入');
      }
    });

    if (submit) submitData();
  });
});
