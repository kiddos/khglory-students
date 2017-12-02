#!/usr/bin/env node

var admins = require('./models/admins');
var students = require('./models/students');
var teachers = require('./models/teachers');
var classes = require('./models/classes');
var regions = require('./models/regions');

admins.migrate();
students.migrate();
teachers.migrate();
classes.migrate();
regions.migration();
