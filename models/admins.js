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
  var admin = this;
  db.serialize(function() {
    db.all(
        'SELECT * FROM admins WHERE username = ? AND passwordMD5 = ?',
        [admin.username, md5(admin.password)], function(err, rows) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          }

          if (rows.length >= 1) {
            admin.id = rows[rows.length - 1].id;
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
              'WHERE id = ?',
          [newUsername, md5(newPassword), admin.id], function(err) {
            if (err) {
              console.error(colors.red(err.message));
              if (callback) callback(false);
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
