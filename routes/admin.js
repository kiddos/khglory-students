var express = require('express');
var router = express.Router();
var admins = require('../models/admins');
var colors = require('colors');

router.get('/admin', function(req, res) {
  if (req.session.login) {
    var adminName = req.params.adminName;
    res.render('admin', {
      title: 'admin',
      login: true,
      user: req.session.user,
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/admin', function(req, res) {
  if (req.session.login) {
    var admin = new admins.Admin(req.session.user.username,
      req.session.user.password);

    var newUsername = req.body.username;
    var newPassword = req.body.password;
    admin.edit(newUsername, newPassword, function(status) {
      if (status) {
        req.session.user = {
          username: admin.username,
          password: admin.password,
        };
        req.session.save(function(err) {
          if (err) {
            res.send('failed');
          } else {
            res.send('success');
          }
        });
      } else {
        res.send('failed');
      }
    });
  } else {
    res.send('failed');
  }
});

router.get('/login', function(req, res) {
  if (req.session.login) {
    res.redirect('/');
  } else {
    res.render('login', {title: 'Login'});
  }
});

router.post('/login', function(req, res) {
  var admin = new admins.Admin(req.body.username, req.body.password);
  admin.login(function(status) {
    if (status) {
      console.log(colors.green(admin.username + ' login success.'));
      req.session.login = true;
      req.session.user = {
        username: admin.username,
        password: admin.password,
      };
      req.session.save(function(err) {
        if (err) {
          res.send('failed');
        } else {
          res.send('success');
        }
      });
    } else {
      console.log(colors.red(admin.username + ' login failed.'));
      res.send('failed');
    }
  });
});

router.post('/logout', function(req, res) {
  req.session.login = false;
  req.session.user = null;
  req.session.save(function(err) {
    if (req.session.user) {
      var admin = req.session.user;
      console.log(colors.green(admin.username + ' logging out.'));
    }
    res.redirect('/');
  });
});

module.exports = router;
