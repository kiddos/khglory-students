#!/usr/bin/env node

var admins = require('./models/admins.js');

admins.migrate();
