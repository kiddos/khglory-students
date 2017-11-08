var db = require('./db_helper');
var md5 = require('md5');
var colors = require('colors');

function migrate() {
  db.serialize(function() {
    db.run(
        'CREATE TABLE IF NOT EXISTS admins(' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'username TEXT NOT NULL,' +
        'passwordMD5 TEXT NOT NULL);');

    db.run('DELETE FROM admins;');

    var statement =
        db.prepare('INSERT INTO admins(username, passwordMD5) VALUES(?, ?)');
    for (var i = 0; i < 3; ++i) {
      statement.run("admin" + i, md5("admin" + i));
    }
    statement.finalize();

    console.log(colors.green('admin migration done.'));
  });
}

function queryAll(callback) {
  db.serialize(function() {
    db.all('SELECT username FROM admins;', [], function(err, rows) {
      if (err) {
        if (callback) callback([]);
      } else {
        if (callback) callback(rows);
      }
    });
  });
}

function Admin(username, password) {
  this.username = username;
  this.password = password;
}

Admin.prototype.login = function(callback) {
  var username = this.username;
  var password = this.password;
  db.serialize(function() {
    db.all(
        'SELECT username FROM admins WHERE username = ? AND passwordMD5 = ?',
        [username, md5(password)], function(err, rows) {
          if (err) {
            if (callback) callback(false);
          }

          if (rows.length === 1 && rows[0].username === username) {
            if (callback) callback(true);
          } else {
            if (callback) callback(false);
          }
        });
  });
};

Admin.prototype.edit = function(newUsername, newPassword, callback) {
  var admin = this;
  this.login(function(status) {
    if (status) {
      db.run(
          'UPDATE admins SET username = ?, passwordMD5 = ?' +
              'WHERE username = ?',
          [newUsername, md5(newPassword), admin.username], function(err) {
            if (err) {
             if (callback)  callback(false);
            }
            admin.username = newUsername;
            admin.password = newPassword;
            if (callback) callback(true);
          });
    } else {
      if (callback) callback(false);
    }
  });
};

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  Admin: Admin,
};
