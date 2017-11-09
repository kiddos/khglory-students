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

router.get('/add', function(req, res, next) {
  if (req.session.login) {
    students.queryAll(function(allStudents) {
      res.render('student_add', {
        title: '學生管理',
        login: true,
        students: allStudents,
        fields: [
          {
            name: 'id',
            text: '號碼',
            require: true,
          },
          {
            name: 'name',
            text: '姓名',
            require: true,
          },
          {
            name: 'gender',
            text: '性別',
            require: false,
          },
          {
            name: 'birthday',
            text: '生日',
            require: false,
          },
          {
            name: 'socialId',
            text: '身份證字號',
            require: false,
          },
          {
            name: 'marriage',
            text: '婚姻',
            require: false,
          },
          {
            name: 'address',
            text: '地址',
            require: false,
          },
          {
            name: 'phone',
            text: '電話',
            require: false,
          },
          {
            name: 'email',
            text: '電子郵件',
            require: false,
          },
        ]
      });
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
