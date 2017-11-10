var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfig({
  "spec_dir": "spec",
  "spec_files": ["./models/*spec.js"],
  "helpers": ["helpers/**/*.js"],
  "stopSpecOnExpectationFailure": false,
  "random": false
});

jasmine.execute();
