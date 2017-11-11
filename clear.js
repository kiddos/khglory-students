#!/usr/bin/env node

var prompt = require('prompt');
var colors = require('colors');

var admins = require('./models/admins');
var students = require('./models/students');
var teachers = require('./models/teachers');
var classes = require('./models/classes');

(function clear() {
  prompt.start();

  prompt.get(['username', 'password'], function(err, result) {
    console.log(result);
    var admin = new admins.Admin(result.username, result.password);
    admin.login(function(status) {
      if (status) {
        console.log(colors.green(admin.username + ' login success.'));
        console.log(colors.yellow('clearning date from db...'));
        students.clear();
        teachers.clear();
        classes.clear();
      } else {
        console.log(colors.red('incorrect username/password'));
      }
    });
  });
})();
