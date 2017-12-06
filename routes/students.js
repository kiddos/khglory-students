var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();

var students = require('../models/students');
var cities = require('../models/cities');

var uploadPath = path.join(__dirname, 'uploads/');
if (!fs.existsSync(uploadPath)) {
  console.log('creating ' + uploadPath);
  fs.mkdirSync(uploadPath);
}
var upload = multer({dest: uploadPath});

router.get('/', function(req, res, next) {
  students.queryAll(function(allStudents) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(allStudents));
  });
});

router.get('/add', function(req, res, next) {
  if (req.session.login) {
    cities.queryAll(function(cityData) {
      res.render('student_add', {
        title: '加入學生資料',
        login: true,
        user: req.session.user,
        city: cityData,
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/add', function(req, res, next) {
  var student = new students.Student(req.body.name);

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

      res.end('success');
    } else {
      res.end('fail');
    }
  });
});

router.get('/edit', function(req, res, next) {
  if (req.session.login) {
    res.render('student_edit', {
      title: '學生資料編輯',
      login: true,
      user: req.session.user,
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/edit', function(req, res, next) {
  if (req.session.login) {
    var student = new students.Student(req.body.name);
    student.id = req.body.id;
    student.find(function(studentData) {
      if (studentData) {
        if (studentData.name !== student.name) {
          student.changeName(student.name);
        }

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
          // create new object if not exists
          if (!extraInfo) {
            extraInfo = new students.ExtraInfo({studentId: student.id});
          }

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

router.post('/delete', function(req, res, next) {
  if (req.session.login) {
    var student = new students.Student(req.body.name);
    student.id = req.body.id;
    student.find(function(status) {
      if (status) {
        student.remove();
        res.send('success');
      } else {
        res.send('failed');
      }
    });
  }
});

module.exports = router;
