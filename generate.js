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
        religion: faker.random.boolean() ? 'Catholic': 'Buddhist',
        illness: faker.random.boolean() ? 'None' : 'common cold',
        emergencyContact: faker.random.boolean() ? 'mom' : 'dad',
        emergencyContactPhone: faker.phone.phoneNumberFormat(1),
      });
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

function generateStudents() {
  var maxCount = 100;
  var index = 0;
  for (var i = 0; i < maxCount; ++i) {
    addStudent();
  }
}

function addTeacher() {
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
    } else {
      console.error(colos.red('fail to insert teacher ') + teacher.name);
    }
  });
}

function generateTeachers() {
  var maxCount = 30;
  var index = 0;
  for (var i = 0; i < maxCount; ++i) {
    addTeacher();
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
      });

      teachers.queryAll(function(teachersData) {
        var index = faker.random.number(teachersData.length);
        c.addTeachers([teachersData[index]]);
      });
    }
  });
}

function generateClasses() {
  var maxCount = 3;
  var index = 0;
  for (var i = 0; i < maxCount; ++i) {
    addClass();
  }
}

(function generate() {
  console.log('generating students...');
  generateStudents();

  console.log('generating teachers...');
  generateTeachers();

  console.log('generating classes...');
  generateClasses();
})();