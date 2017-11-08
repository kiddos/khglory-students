var express = require('express');
var router = express.Router();
var admins = require('../models/admins');
var colors = require('colors');

router.get('/', function(req, res) { res.render('admin', {title: 'Login'}); });

router.post('/', function(req, res) {
  var admin = new admins.Admin(req.body.username, req.body.password);
  admin.login(function(status) {
    if (status) {
      console.log(colors.green(username + ' login success.'));
      req.session.login = true;
      req.session.save(function(err) {
        if (err) {
          res.redirect('/login');
        } else {
          res.redirect('/');
        }
      });
    } else {
      console.log(color.red(username + ' login failed.'));
      res.redirect('/login');
    }
  });
});

module.exports = router;