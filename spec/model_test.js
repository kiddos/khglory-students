var Jasmine = require('jasmine');
var jasmine = new Jasmine();

var admins = require('../models/admins');
var students = require('../models/students');
var teachers = require('../models/teachers');
var classes = require('../models/classes');

admins.migrate();
students.migrate();
teachers.migrate();
classes.migrate();

jasmine.loadConfig({
  "spec_dir": "spec",
  "spec_files": ["./models/*spec.js"],
  "helpers": ["helpers/**/*.js"],
  "stopSpecOnExpectationFailure": false,
  "random": false
});

jasmine.execute();
