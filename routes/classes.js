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
  // if (req.session.login) {
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
  // } else {
  //   res.redirect('/login');
  // }
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

router.get('/edit', function(req, res) {});

router.post('/edit', function(req, res) {});

module.exports = router;
