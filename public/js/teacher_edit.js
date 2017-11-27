$(document).ready(function() {
  function collectData($row) {
    var teacher = {};
    $row.find('td').each(function() {
      var key = $(this).attr('class').substring(5);
      if (key === 'edit' || key === 'id hide') return;
      else {
        var val = $(this).children('input.edit-field').val();
        teacher[key] = val;
      }
      teacher.id = $row.find('td.info-id').text();
    });
    return teacher;
  }

  $.get('/teachers', function(allTeachers) {
    var createRow = function(teacher) {
      var $row = $('<tr>', {});

      var $edit = $('<td>', {class: 'info-edit'});
      var $confirm = $('<input>',
        {type: 'button', class: 'confirm button', value: '寫入'});
      $confirm.on('click', function() {
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
      $edit.append($confirm);

      var $delete = $('<input>',
        {type: 'button', class: 'delete button', value: '刪除'});
      $delete.on('click', function() {
        var $row = $(this).closest('tr');
        popupMessage('刪除', '確定要刪除資料嗎？', function() {
          var teacher = collectData($row);
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
      $edit.append($delete);
      $row.append($edit);

      var $id = $('<td>', {class: 'info-id hide'});
      $id.text(teacher.id);
      $row.append($id);

      var $name = $('<td>', {class: 'info-name'});
      $name.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: teacher.name ? teacher.name : ''
      }));
      $row.append($name);

      var $gender = $('<td>', {class: 'info-gender'});
      $gender.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: teacher.gender ? teacher.gender : ''
      }));
      $row.append($gender);

      var $birthday = $('<td>', {class: 'info-birthday'});
      $birthday.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: teacher.birthday ? new Date(teacher.birthday).toLocaleDateString('tw-zh') : ''
      }));
      $row.append($birthday);

      var $address = $('<td>', {class: 'info-address'});
      $address.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: teacher.address ? teacher.address : ''
      }));
      $row.append($address);

      var $phone = $('<td>', {class: 'info-phone'});
      $phone.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: teacher.phone ? teacher.phone : ''
      }));
      $row.append($phone);

      var $email = $('<td>', {class: 'info-email'});
      $email.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: teacher.email ? teacher.email : ''
      }));
      $row.append($email);

      return $row;
    };

    var windowSize = 66;
    var bufferSize = 10;
    var index = 0;
    // initialize table
    var $tableBody = $('#teacher-table');
    for (var i = 0; i < Math.min(windowSize, allTeachers.length); ++i) {
      var $row = createRow(allTeachers[i]);
      $tableBody.append($row);
    }

    $tableBody.scroll(function() {
      var j, loadCount, $newRow;
      if ($(this).scrollTop() + $(this).innerHeight() >=
          $(this)[0].scrollHeight) {
        if (index + windowSize < allTeachers.length) {
          // append new rows if data is found
          loadCount = Math.min(bufferSize,
            allTeachers.length - index - windowSize);
          for (j = 0; j < loadCount; ++j) {
            $newRow = createRow(allTeachers[index + windowSize + j]);
            $tableBody.append($newRow);
            // remove old rows
            $tableBody.children('tr:first').remove();
          }
          index += loadCount;
        }
      } else if ($(this).scrollTop() <= 0) {
        loadCount = Math.min(bufferSize, index);
        for (j = 0; j < loadCount; ++j) {
          $newRow = createRow(allTeachers[index - j - 1]);
          $tableBody.prepend($newRow);
          $tableBody.children('tr:last').remove();
          $tableBody.scrollTop($tableBody.scrollTop() + 16);
        }
        index -= loadCount;
      }
    });
  });
});
