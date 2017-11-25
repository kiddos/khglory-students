var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.login) {
    res.render('index', {
      title: '高雄榮光堂統計系統',
      login: true,
      user: req.session.user,
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
