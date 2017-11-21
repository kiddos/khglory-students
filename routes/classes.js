var express = require('express');
var router = express.Router();

var students = require('../models/students');
var teachers = require('../models/teachers');
var classes = require('../models/classes');

router.get('/', function(req, res) {
  if (req.session.login) {
    res.render('classes', {title: '課程管理', login: true});
  } else {
    res.redirect('/login');
  }
});

router.get('/add', function(req, res) {
  if (req.session.login) {
    students.queryAll(function(allStudents) {
      teachers.queryAll(function(allTeachers) {
        res.render('class_add', {
          title: '增加課程',
          login: true,
          info_form: true,
          students: allStudents,
          teachers: allTeachers
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/add', function(req, res) {
  var data = JSON.parse(req.body.data);
  var startDate = data.startDate;
  if (!startDate) startDate = new Date().toString();

  var c = new classes.Class(data.name, startDate);
  c.insert(function(status) {
    if (status) {
      c.addTeachers(data.teachers);
      c.addStudents(data.students);

      res.send('success');
    } else {
      res.send('failed');
    }
  });
});

router.get('/edit', function(req, res) {
  // if (req.session.login) {
  students.queryAll(function(allStudents) {
    teachers.queryAll(function(allTeachers) {
      classes.queryAll(function(allClasses) {
        res.render('class_edit', {
          title: '修改課程',
          login: true,
          info_form: true,
          classes: allClasses,
          students: allStudents,
          teachers: allTeachers,
        });
      });
    });
  });
  // } else {
  //   res.redirect('/login');
  // }
});

router.get('/edit/:classId', function(req, res) {
  var classId = req.params.classId;
  var c = new classes.Class();
  c.id = classId;

  var data = {};
  c.getStudents(function(allStudents) {
    data.students = allStudents;

    c.getTeachers(function(allTeachers) {
      data.teachers = allTeachers;
      res.end(JSON.stringify(data));
    });
  });
});

router.post('/edit', function(req, res) {
  var data = JSON.parse(req.body.data);
  var c = new classes.Class();
  c.id = data.classId;

  c.edit(data.className, data.startDate, function(status) {
    if (status) {
      c.getStudents(function(originalStudents) {
        c.removeStudents(originalStudents, function(status) {
          if (status) {
            console.log('edit students for class ' + data.className);
            c.addStudents(data.students);
          }
        });
      });

      c.getTeachers(function(originalTeachers) {
        c.removeTeachers(originalTeachers, function(status) {
          if (status) {
            console.log('edit teachers for class ' + data.className);
            c.addTeachers(data.teachers);
          }
        });
      });

      res.send('success');
    } else {
      res.send('failed');
    }

  });
});

module.exports = router;
