var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();

var students = require('../models/students');

var uploadPath = path.join(__dirname, 'uploads/');
if (!fs.existsSync(uploadPath)) {
  console.log('creating ' + uploadPath);
  fs.mkdirSync(uploadPath);
}
var upload = multer({dest: uploadPath});

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
        title: '加入學生資料',
        login: true,
        students: allStudents,
        student_style: true,
        student_add: true,
        basicFields: [
          {
            name: 'id',
            type: 'text',
            text: '號碼',
            require: true,
          },
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
  } else {
    res.redirect('/login');
  }
});

router.post('/add', upload.single('hardCopy'), function(req, res, next) {
  var student = new students.Student(req.body.id, req.body.name);
  student.insert(function(status) {
    if (status) {
      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: req.body.gender,
        birthday: req.body.birthday,
        socialId: req.body.socialId,
        marriage: req.body.marriage,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
      });
      student.addBasicInfo(basicInfo);

      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: req.body.career,
        education: req.body.education,
        religion: req.body.religion,
        illness: req.body.illness,
        emergencyContact: req.body.emergencyContact,
        emergencyContactPhone: req.body.emergencyContactPhone,
      });
      student.addExtraInfo(extraInfo);

      if (req.file) {
        fs.readFile(req.file, function(err, data) {
          if (!err) {
            var hardCopy = new students.HardCopy({
              studentId: student.id,
              hardCopy: data,
            });
            student.addHardCopy(hardCopy);
          }
        });
      }

      res.end('success');
    } else {
      res.end('fail');
    }
  });
});

router.get('/edit', function(req, res, next) {
  if (req.session.login) {
    students.queryAll(function(allStudents) {
      res.render('student_edit', {
        title: '學生資料編輯',
        students: allStudents,
        login: true,
        student_style: true,
        student_edit: true,
        user: req.session.user,
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/edit', function(req, res, next) {
  if (req.session.login) {
    var student = new students.Student(req.body.id, req.body.name);
    student.find(function(status) {
      if (status) {
        student.getBasicInfo(function(basicInfo) {
          var mod = false;
          var keys = Object.keys(basicInfo);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (req.body[key] && req.body[key] !== basicInfo[key]) {
              basicInfo[key] = req.body[key];
              console.log(basicInfo[key]);
              mod = true;
            }
          }

          if (mod) {
            console.log('updating basic info for ' + student.name);
            student.updateBasicInfo(basicInfo, function(status) {
              if (!status) {
                console.error(
                    colors.red(
                        'fail to update basic info for ' + student.name));
              }
            });
          }
        });

        student.getExtraInfo(function(extraInfo) {
          var mod = false;
          var keys = Object.keys(extraInfo);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (req.body[key] && req.body[key] !== extraInfo[key]) {
              extraInfo[key] = req.body[key];
              mod = true;
            }
          }

          if (mod) {
            console.log('updating extra info for ' + student.name);
            student.updateExtraInfo(extraInfo, function(status) {
              if (!status) {
                console.error('fail to update extra info for ' + student.name);
              }
            });
          }
        });

        student.getHardCopy(function(hardCopy) {
          var mod = false;
          var keys = Object.keys(hardCopy);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (req.body[key] && req.body[key] !== hardCopy[key]) {
              hardCopy[key] = req.body[key];
              mod = true;
            }
          }

          if (mod) {
            console.log('updating hard copy for ' + student.name);
            student.updateHardCopy(hardCopy, function(status) {
              if (!status) {
                console.error('fail to update hard copy for ' + student.name);
              }
            });
          }
        });

        console.log('user found');
        res.end('success');
      } else {
        res.end('fail');
      }
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
