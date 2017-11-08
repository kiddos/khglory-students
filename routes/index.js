var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.login) {
    res.render('index', {title: '管理'});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
