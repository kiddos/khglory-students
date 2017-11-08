var db = require('./db_helper');
var colors = require('colors');

function migrate() {
  db.serialize(function() {
    db.run(
        'CREATE TABLE IF NOT EXISTS classes(' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'name TEXT NOT NULL,' +
        'startDate TEXT NOT NULL);');
    db.run(
        'CREATE TABLE IF NOT EXISTS classStudents(' +
        'classId REFERENCES classes(id),' +
        'studentId REFERENCES students(id));');
    db.run(
        'CREATE TABLE IF NOT EXISTS classTeachers(' +
        'classId REFERENCES classes(id),' +
        'teacherId REFERENCES teachers(id));');

    console.log(colors.green('classes migration done.'));
  });
}

function queryAll(callback) {
  db.serialize(function() {
    db.all('SELECT * FROM classes;', function(err, rows) {
      if (err) {
        console.log(colors.red(err.message));
        callback([]);
      } else {
        callback(rows);
      }
    });
  });
}

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
};
