var express = require('express');
var router = express.Router();

var teachers = require('../models/teachers');

router.get('/', function(req, res, next) {
  if (req.session.login) {
    res.render('teachers', {title: '老師管理', login: true});
  } else {
    res.redirect('/login');
  }
});

router.get('/add', function(req, res, next) {
  res.render('teacher_add', {
    title: '加入老師資料',
    login: true,
    info_form: true,
    teacher_add: true,
    basicFields: [
      {
        name: 'name',
        type: 'text',
        text: '姓名',
        require: true,
      },
      {
        name: 'gender',
        type: 'radio',
        options: ['男', '女'],
        text: '性別',
        require: false,
      },
      {
        name: 'birthday',
        type: 'text',
        text: '生日',
        require: false,
      },
      {
        name: 'socialId',
        type: 'text',
        text: '身份證字號',
        require: false,
      },
      {
        name: 'marriage',
        type: 'radio',
        options: ['單身', '已婚', '離婚'],
        text: '婚姻',
        require: false,
      },
      {
        name: 'address',
        type: 'text',
        text: '地址',
        require: false,
      },
      {
        name: 'phone',
        type: 'text',
        text: '電話',
        require: false,
      },
      {
        name: 'email',
        type: 'text',
        text: '電子郵件',
        require: false,
      },
    ],
    extraFields: [
      {
        name: 'career',
        type: 'text',
        text: '職業',
        require: false,
      },
      {
        name: 'education',
        type: 'radio',
        options: ['高中以下', '大學', '碩士', '博士'],
        text: '教育',
        require: false,
      },
      {
        name: 'religion',
        type: 'radio',
        options: ['基督教', '天主教', '佛教', '伊斯蘭教', '其他'],
        text: '信仰',
        require: false,
      },
      {
        name: 'illness',
        type: 'text',
        text: '個人疾病',
        require: false,
      },
      {
        name: 'emergencyContact',
        type: 'text',
        text: '緊急聯絡人',
        require: false,
      },
      {
        name: 'emergencyContactPhone',
        type: 'text',
        text: '緊急聯絡人電話',
        require: false,
      },
    ],
  });
});

router.post('/add', function(req, res, next) {
  var teacher = new teachers.Teacher(req.body.name);
  teacher.insert(function(status) {
    if (status) {
      var basicInfo = new teachers.BasicInfo({
        teacherId: teacher.id,
        gender: req.body.gender,
        birthday: req.body.birthday,
        socialId: req.body.socialId,
        marriage: req.body.marriage,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
      });
      teacher.addBasicInfo(basicInfo);

      res.send('success');
    } else {
      res.send('failed');
    }
  });
});

module.exports = router;
