var sqlite3 = require('sqlite3').verbose();
var settings = require('../settings.js');
var md5 = require('md5');
var colors = require('colors');

var db = new sqlite3.Database(settings.db, function(err) {
  if (err) {
    return console.error(colors.red(err.message));
  }
  console.log('Connected to sqlite3 database');
});

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
            callback(false);
          }

          if (rows.length === 1 && rows[0].username === username) {
            callback(true);
          } else {
            callback(false);
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
              callback(false);
            }
            admin.username = newUsername;
            admin.password = newPassword;
            callback(true);
          });
    } else {
      callback(false);
    }
  });
};

function queryAll(callback) {
  db.serialize(function() {
    db.all('SELECT username FROM admins;', [], function(err, rows) {
      callback(rows);
    });
  });
}

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

  db.close(function(err) {
    if (err) {
      return console.error(colors.red(err.message));
    }
    console.log('close sqlite3 database connection');
  });
}

module.exports = {
  Admin: Admin,
  migrate: migrate,
  queryAll: queryAll,
};
