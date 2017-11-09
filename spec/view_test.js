var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfig({
  "spec_dir": "spec",
  "spec_files": ["./view/*Spec.js"],
  "helpers": ["helpers/**/*.js"],
  "stopSpecOnExpectationFailure": false,
  "random": false
});

jasmine.execute();
