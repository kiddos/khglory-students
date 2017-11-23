#!/usr/bin/env node

var faker = require('faker');
var colors = require('colors');

var students = require('./models/students');
var teachers = require('./models/teachers');
var classes = require('./models/classes');

function addStudent(callback) {
  var name = faker.name.firstName() + ' ' + faker.name.lastName();
  var student = new students.Student(String(faker.random.uuid()), name);
  student.insert(function(status) {
    if (status) {
      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? 'male' : 'female',
        birthday: faker.date.between('1900-01-01', '2016-12-31'),
        socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? 'married' : 'single',
        address: faker.address.streetAddress("###"),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo);

      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: faker.name.jobTitle(),
        education: faker.random.boolean() ? 'graduate' : 'undergrad',
        illness: faker.random.boolean() ? 'None' : 'common cold',
        emergencyContact: faker.random.boolean() ? 'mom' : 'dad',
        emergencyContactPhone: faker.phone.phoneNumberFormat(1),
      });
      var r = faker.random.number(5);
      switch (r) {
        case 0:
          extraInfo.religion = '基督教';
          break;
        case 1:
          extraInfo.religion = '天主教';
          break;
        case 2:
          extraInfo.religion = '佛教';
          break;
        case 3:
          extraInfo.religion = '伊斯蘭教';
          break;
        default:
          extraInfo.religion = '睡教';
          break;
      }
      student.addExtraInfo(extraInfo);

      var hardCopy = new students.HardCopy({
        studentId: student.id,
        hardCopy: faker.image.image(),
      });
      student.addHardCopy(hardCopy);

      if (callback) callback();
    } else {
      console.error(colors.red('fail to insert ' + student.name));
    }
  });
}

function generateStudents(done) {
  console.log('generating students...');

  var maxCount = 100;
  var index = 0;
  for (var i = 0; i < maxCount; ++i) {
    if (i === maxCount - 1) {
      addStudent(done);
    } else {
      addStudent();
    }
  }
}

function addTeacher(callback) {
  var name = faker.name.firstName() + ' ' + faker.name.lastName();
  var teacher = new teachers.Teacher(name);
  teacher.insert(function(status) {
    if (status) {
      var basicInfo = new teachers.BasicInfo({
        gender: faker.random.boolean() ? 'male' : 'female',
        birthday: faker.date.between('1900-01-01', '2016-12-31'),
        socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? 'married' : 'single',
        address: faker.address.streetAddress("###"),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      teacher.addBasicInfo(basicInfo);

      if (callback) callback();
    } else {
      console.error(colos.red('fail to insert teacher ') + teacher.name);
    }
  });
}

function generateTeachers(done) {
  console.log('generating teachers...');

  var maxCount = 30;
  var index = 0;
  for (var i = 0; i < maxCount; ++i) {
    if (i === maxCount - 1) {
      addTeacher(done);
    } else {
      addTeacher();
    }
  }
}

function addClass() {
  var name = 'Class ' + faker.random.number(10000);
  var startDate = faker.date.past(1);
  var c = new classes.Class(name, startDate);
  c.insert(function(status) {
    if (status) {
      students.queryAll(function(studentsData) {
        var choosen = [];
        for (var i = 0; i < studentsData.length; ++i) {
          if (faker.random.boolean()) {
            choosen.push(studentsData[i]);
          }
        }
        c.addStudents(choosen);

        teachers.queryAll(function(teachersData) {
          var index = faker.random.number(teachersData.length);
          c.addTeachers([teachersData[index]]);
        });
      });
    }
  });
}

function generateClasses() {
  console.log('generating classes...');

  var maxCount = 3;
  var index = 0;
  for (var i = 0; i < maxCount; ++i) {
    addClass();
  }
}

(function generate() {
  generateStudents(function() {
    generateTeachers(function() { setTimeout(generateClasses, 1000); });
  });
})();
