var express = require('express');
var router = express.Router();
var child_process = require('child_process');

router.get('/', function(req, res) {
  child_process.exec('git pull origin master', function(err, stdout, stderr) {
    if (err) {
      console.error(err.message);
      res.send('failed');
    } else {
      console.log(stdout);
      child_process.exec('git checkout master', function(err, stdout, stderr) {
        if (err) {
          console.error(err.message);
          res.send('failed');
        } else {
          console.log(stdout);
          res.send('success');
        }
      });
    }
  });
});

module.exports = router;
