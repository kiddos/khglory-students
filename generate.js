#!/usr/bin/env node

var faker = require('faker');
var colors = require('colors');

var students = require('./models/students');
var teachers = require('./models/teachers');
var classes = require('./models/classes');

function generateStudents(callback) {
  console.log('generating students...');
  students.generateStudents(100, function() {
    if (callback) callback();
  });
}


function generateTeachers(callback) {
  console.log('generating teachers...');

  teachers.generateTeachers(10, function() {
    if (callback) callback();
  });
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
          if (choosen.length > 20) break;
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
