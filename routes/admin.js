var express = require('express');
var router = express.Router();
var admins = require('../models/admins');
var colors = require('colors');

router.get('/', function(req, res) {
  if (req.session.login) {
    res.redirect('/');
  } else {
    res.render('admin', {title: 'Login'});
  }
});

router.post('/', function(req, res) {
  var admin = new admins.Admin(req.body.username, req.body.password);
  admin.login(function(status) {
    if (status) {
      console.log(colors.green(admin.username + ' login success.'));
      req.session.login = true;
      req.session.user = admin;
      req.session.save(function(err) {
        if (err) {
          res.redirect('/login');
        } else {
          res.redirect('/');
        }
      });
    } else {
      console.log(colors.red(admin.username + ' login failed.'));
      res.redirect('/login');
    }
  });
});

router.post('/logout', function(req, res) {
  req.session.login = false;
  if (req.session.user) {
    var admin = req.session.user;
    console.log(colors.green(admin.username + ' logging out.'));
  }
  res.redirect('/');
});

module.exports = router;
