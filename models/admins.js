var sqlite3 = require('sqlite3').verbose();
var settings = require('../settings.js');
var db = new sqlite3.Database(settings.db);
var md5 = require('md5');
var colors = require('colors');

function Admin(username, password) {
  this.username = username;
  this.password = password;
}

Admin.prototype.login = function(callback) {
  var password = this.password;
  db.serialize(function() {
    db.all(
        'SELECT username FROM admins WHERE passwordMD5 = ?', [md5(password)],
        function(err, rows) {
          if (rows.length === 1 && rows.username === this.username) {
            callback(true);
          } else {
            callback(false);
          }
        });
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

  db.close();
}

module.exports = {
  Admin: Admin,
  migrate: migrate,
  queryAll: queryAll,
};
