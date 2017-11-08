var express = require('express');
var router = express.Router();

var students = require('../models/students');

router.get('/', function(req, res, next) {
  if (req.session.login) {
    students.queryAll(function(allStudents) {
      res.render(
          'students', {title: '學生管理', login: true, students: allStudents});
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
