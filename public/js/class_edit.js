$(document).ready(function() {
  function setupTable($tableBody, data, windowSize, bufferSize, createRow) {
    var index = 0;
    // initialize table
    for (var i = 0; i < Math.min(windowSize, data.length); ++i) {
      var $row = createRow(data[i]);
      $tableBody.append($row);
    }

    $tableBody.scroll(function() {
      var j, loadCount, $newRow;
      var bufferRange = 6;
      if ($tableBody.scrollTop() + $tableBody.innerHeight() >=
          $tableBody[0].scrollHeight - bufferRange) {
        if (index + windowSize < data.length) {
          // append new rows if data is found
          loadCount = Math.min(bufferSize,
            data.length - index - windowSize);
          for (j = 0; j < loadCount; ++j) {
            $newRow = createRow(data[index + windowSize + j]);
            $tableBody.append($newRow);
            // remove old rows
            $tableBody.children('tr:first').remove();
          }
          index += loadCount;
        }
      } else if ($tableBody.scrollTop() <= bufferRange) {
        loadCount = Math.min(bufferSize, index);
        for (j = 0; j < loadCount; ++j) {
          $newRow = createRow(data[index - j - 1]);
          $tableBody.prepend($newRow);
          $tableBody.children('tr:last').remove();
          $tableBody.scrollTop($tableBody.scrollTop() + 16);
        }
        index -= loadCount;
      }
    });
  }

  $.get('/classes', function(allClasses) {
    function toggleButtonPanel() {
      $('.info-button-panel').find('input[type="button"].button').each(
        function() {
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

    var classId, className, classStartDate;

    var createRow = function(c) {
      var $row = $('<tr>', {});

      var $edit = $('<td>', {class: 'info-edit'});
      var $confirm = $('<input>',
        {type: 'button', class: 'confirm button', value: '確定編輯'});
      $confirm.on('click', function() {
        var $row = $(this).closest('tr');

        toggleLists();
        toggleButtonPanel();
        // togglePanelSize();

        classId = parseInt($row.find('td.info-id').text());
        className = $row.find('td.info-name input[type="text"]').val();
        classStartDate = $row.find('td.info-startDate input[type="text"]').val();

        // fetch all students and teachers to display
        $.ajax({
          url: '/classes/edit/' + classId,
          method: 'GET',
          contentType: 'application/json',
        }).done(function(data) {
          var classTeachers = data.teachers;
          var classStudents = data.students;

          $('#student-table').children('tr').remove();
          $.get('/students', function(allStudents) {
            var createStudentRow = function(student) {
              var $row = $('<tr>', {});
              var $edit = $('<td>', {class: 'info-edit'});
              var $checkbox = $('<input>', {
                type: 'checkbox',
                checked: student.attend ? true : false,
              });
              $edit.append($checkbox);
              $row.append($edit);

              var $id = $('<td>', {class: 'info-id hide'});
              $id.text(student.id);
              $row.append($id);

              var $name = $('<td>', {class: 'info-name'});
              $name.text(student.name ? student.name : '');
              $row.append($name);

              return $row;
            };

            // sort with students in class have higher priority
            for (var i = 0; i < allStudents.length; ++i) {
              // if the student is in the class
              // remove the student and add it to the front
              for (var j = 0; j < classStudents.length; ++j) {
                if (allStudents[i].id === classStudents[j].id) {
                  var s = allStudents.splice(i, 1);
                  s[0].attend = true;
                  allStudents.unshift(s[0]);
                  break;
                }
              }
            }

            setupTable($('#student-table'), allStudents,
              66, 10, createStudentRow);
            students = allStudents;
          });

          $('#teacher-table').children('tr').remove();
          $.get('/teachers', function(allTeachers) {
            var createTeacherRow = function(teacher) {
              var $row = $('<tr>', {});
              var $edit = $('<td>', {class: 'info-edit'});
              var $checkbox = $('<input>', {
                type: 'checkbox',
                checked: teacher.attend ? true : false,
              });
              $edit.append($checkbox);
              $row.append($edit);

              var $id = $('<td>', {class: 'info-id hide'});
              $id.text(teacher.id);
              $row.append($id);

              var $name = $('<td>', {class: 'info-name'});
              $name.text(teacher.name ? teacher.name : '');
              $row.append($name);

              return $row;
            };

            for (var i = 0; i < allTeachers.length; ++i) {
              // if the student is in the class
              // remove the student and add it to the front
              for (var j = 0; j < classTeachers.length; ++j) {
                if (allTeachers[i].id === classTeachers[j].id) {
                  var t = allTeachers.splice(i, 1);
                  t[0].attend = true;
                  allTeachers.unshift(t[0]);
                  break;
                }
              }
            }

            setupTable($('#teacher-table'), allTeachers, 66, 10, createTeacherRow);
            teachers = allTeachers;
          });
        });
      });
      $edit.append($confirm);

      var $delete = $('<input>',
        {type: 'button', class: 'delete button', value: '刪除'});
      $delete.on('click', function() {
        var $row = $(this).closest('tr');
        var classId = parseInt($row.find('td.info-id').text());
        var className = $row.find('td.info-name input[type="text"]').val();
        var startDate = $row.find('td.info-startDate input[type="text"]').val();

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
            infoMessage('刪除課程成功', 1000);
          } else {
            errorMessage('刪除課程失敗, 請稍後再試', 1000);
          }
        });
      });
      $edit.append($delete);
      $row.append($edit);

      var $id = $('<td>', {class: 'info-id hide'});
      $id.text(c.id);
      $row.append($id);

      var $name = $('<td>', {class: 'info-name'});
      $name.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: c.name ? c.name : ''
      }));
      $row.append($name);

      var $startDate = $('<td>', {class: 'info-startDate'});
      $startDate.append($('<input>', {
        type: 'text',
        class: 'edit-field',
        value: c.startDate ? new Date(c.startDate).toLocaleDateString('tw-zh') : ''
      }));
      $row.append($startDate);

      return $row;
    };

    setupTable($('#class-table'), allClasses, 66, 10, createRow);

    $('#previous').on('click', function() {
      toggleLists();
      toggleButtonPanel();
    });

    $('#confirm').on('click', function() {
      var data = {};
      data.classId = parseInt(classId);
      data.className = className;
      data.startDate = new Date(classStartDate).getTime();

      data.students = [];
      $('#students').find('tr').each(function() {
        if ($(this).find('td.info-edit input[type="checkbox"]').prop('checked')) {
          data.students.push({
            id: $(this).find('td.info-id').text(),
            name: $(this).find('td.info-name').text(),
          });
        }
      });

      data.teachers = [];
      $('#teachers').find('tr').each(function() {
        if ($(this).find('td.info-edit input[type="checkbox"]').prop('checked')) {
          data.teachers.push({
            id: parseInt($(this).find('td.info-id').text()),
            name: $(this).find('td.info-name').text(),
          });
        }
      });

      $.ajax({
        url: '/classes/edit',
        method: 'POST',
        data: { data: JSON.stringify(data)},
      }).done(function(response) {
        if (response === 'success') {
          toggleLists();
          toggleButtonPanel();
          // togglePanelSize();

          classId = className = classStartDate = null;
          infoMessage('修改課程成功', 1000);
        } else {
          errorMessage('修改課程失敗, 請稍後再試', 1000);
        }
      });
    });
  });
});
