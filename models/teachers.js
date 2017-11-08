var db = require('./db_helper');
var colors = require('colors');

function migrate() {
  db.serialize(function() {
    db.run(
        'CREATE TABLE IF NOT EXISTS teachers(' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'name TEXT NOT NULL);');
    db.run(
        'CREATE TABLE IF NOT EXISTS teacherInfo(' +
        'teacherId REFERENCES teachers(id),' +
        'gender TEXT,' +
        'birthday INTEGER,' +
        'socialId TEXT,' +
        'marriage TEXT,' +
        'address TEXT,' +
        'phone TEXT,' +
        'email TEXT);');
    console.log(colors.green('teachers migration done.'));
  });
}

function queryAll(callback) {
  db.serialize(function() {
    db.all(
        'SELECT t.id, t.name,' +
            'ti.gender, ' +
            'ti.birthday,' +
            'ti.socialId,' +
            'ti.marriage,' +
            'ti.address,' +
            'ti.phone,' +
            'ti.email, ' +
            'FROM teachers t ' +
            'LEFT JOIN teacherInfo ti ON t.id = ti.teacherId;',
        function(err, rows) {
          if (err) {
            console.log(colors.red(err.message));
            callback([]);
          } else {
            callback(rows);
          }
        });
  });
}

function clear(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      transaction.exec('DELETE FROM teachers;');
      transaction.exec('DELETE FROM teacherInfo;');

      transaction.commit(function(err) {
        if (err) {
          console.error(colors.red(err.message));
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      });
    });
  });
}

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
};
