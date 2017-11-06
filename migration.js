#!/usr/bin/env node

var admins = require('./models/admins.js');
var students = require('./models/students.js');

admins.migrate();
students.migrate();
