$(document).ready(function() {
  $.get('/students', function(allStudents) {
    var createRow = function(student) {
      var $row = $('<tr>', {});

      var $edit = $('<td>', {class: 'info-edit'});
      var $confirm = $('<input>',
        {type: 'button', class: 'confirm button', value: '寫入'});
      $confirm.on('click', function() {
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
        });
      });
      $edit.append($confirm);

      var $delete = $('<input>',
        {type: 'button', class: 'delete button', value: '刪除'});
      $delete.on('click', function() {
        var $row = $(this).closest('tr');
        popupMessage('刪除', '您確定要刪除嗎？', function() {
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
      $edit.append($delete);
      $row.append($edit);

      var $id = $('<td>', {class: 'info-id hide'});
      $id.text(student.id);
      $row.append($id);

      var $name = $('<td>', {class: 'info-name'});
      $name.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: student.name ? student.name : ''
      }));
      $row.append($name);

      var $gender = $('<td>', {class: 'info-gender'});
      $gender.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: student.gender ? student.gender : ''
      }));
      $row.append($gender);

      var $birthday = $('<td>', {class: 'info-birthday'});
      $birthday.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: student.birthday ? new Date(student.birthday).toLocaleDateString('tw-zh') : ''
      }));
      $row.append($birthday);

      var $address = $('<td>', {class: 'info-address'});
      $address.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: student.address ? student.address : ''
      }));
      $row.append($address);

      var $phone = $('<td>', {class: 'info-phone'});
      $phone.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: student.phone ? student.phone : ''
      }));
      $row.append($phone);

      var $email = $('<td>', {class: 'info-email'});
      $email.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: student.email ? student.email : ''
      }));
      $row.append($email);

      return $row;
    };

    var windowSize = 66;
    var bufferSize = 10;
    var index = 0;
    // initialize table
    var $tableBody = $('#student-table');
    for (var i = 0; i < Math.min(windowSize, allStudents.length); ++i) {
      var $row = createRow(allStudents[i]);
      $tableBody.append($row);
    }

    $tableBody.scroll(function() {
      var j, loadCount, $newRow;
      if ($(this).scrollTop() + $(this).innerHeight() >=
          $(this)[0].scrollHeight) {
        if (index + windowSize < allStudents.length) {
          // append new rows if data is found
          loadCount = Math.min(bufferSize,
            allStudents.length - index - windowSize);
          for (j = 0; j < loadCount; ++j) {
            $newRow = createRow(allStudents[index + windowSize + j]);
            $tableBody.append($newRow);
            // remove old rows
            $tableBody.children('tr:first').remove();
          }
          index += loadCount;
        }
      } else if ($(this).scrollTop() <= 0) {
        loadCount = Math.min(bufferSize, index);
        for (j = 0; j < loadCount; ++j) {
          $newRow = createRow(allStudents[index - j - 1]);
          $tableBody.prepend($newRow);
          $tableBody.children('tr:last').remove();
          $tableBody.scrollTop($tableBody.scrollTop() + 16);
        }
        index -= loadCount;
      }
    });
  });
});
