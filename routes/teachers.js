var express = require('express');
var router = express.Router();

var teachers = require('../models/teachers');

router.get('/', function(req, res, next) {
  if (req.session.login) {
    teachers.queryAll(function(allTeachers) {
      res.render(
          'teachers', {title: '老師管理', login: true, students: allTeachers});
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
