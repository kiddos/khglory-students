var express = require('express');
var router = express.Router();
var csv = require('csv');

var students = require('../models/students');
var teachers = require('../models/teachers');
var classes = require('../models/classes');

function prepareResponseWithFile(res, fileName) {
  res.writeHead(200, {
    'Content-Disposition': 'attachment; filename=' + fileName,
    'Content-Transfer-Encoding': 'binary',
    'Content-Type': 'application/octet-stream',
  });
}

router.get('/', function(req, res) {
  res.render('query', {title: '報表下載', login: true});
});

router.get('/students', function(req, res, next) {
  students.queryAll(function(allStudents) {
    csv.stringify(allStudents, function(err, output) {
      if (err) {
        next();
      } else {
        prepareResponseWithFile(res, 'students.csv');
        res.end(output);
      }
    });
  });
});

router.get('/teachers', function(req, res, next) {
  teachers.queryAll(function(allTeachers) {
    csv.stringify(allTeachers, function(err, output) {
      if (err) {
        next();
      } else {
        prepareResponseWithFile(res, 'teachers.csv');
        res.end(output);
      }
    });
  });
});

router.get('/classes', function(req, res) {
  if (req.session.login) {
    classes.queryAll(function(allClasses) {
      res.render('query_classes', {
        title: '課程列表下載',
        login: true,
        classes: allClasses,
        user: req.session.user,
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/classes/students', function(req, res, next) {
  var classId = parseInt(req.query.id);
  var className = req.query.name;
  var classStartDate = parseInt(req.query.startDate);
  var c = new classes.Class(className, classStartDate);
  c.id = classId;

  c.getStudents(function(classStudents) {
    csv.stringify(classStudents, function(err, output) {
      if (err) {
        next();
      } else {
        prepareResponseWithFile(
            res, className + '-' +
                new Date(classStartDate).toLocaleDateString('tw-zh') +
                '-students.csv');
        res.end(output);
      }
    });
  });
});

router.get('/classes/teachers', function(req, res, next) {
  var classId = parseInt(req.query.id);
  var className = req.query.name;
  var classStartDate = parseInt(req.query.startDate);
  var c = new classes.Class(className, classStartDate);
  c.id = classId;

  c.getTeachers(function(classTeachers) {
    csv.stringify(classTeachers, function(err, output) {
      if (err) {
        next();
      } else {
        prepareResponseWithFile(
            res, className + '-' +
                new Date(classStartDate).toLocaleDateString('tw-zh') +
                '-teachers.csv');
        res.end(output);
      }
    });
  });
});

module.exports = router;
