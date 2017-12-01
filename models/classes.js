var db = require('./db_helper');
var colors = require('colors');

function migrate() {
  db.serialize(function() {
    db.run(
        'CREATE TABLE IF NOT EXISTS classes(' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'name TEXT NOT NULL,' +
        'startDate INTEGER);');
    db.run(
        'CREATE TABLE IF NOT EXISTS classStudents(' +
        'classId REFERENCES classes(id) ON DELETE CASCADE NOT NULL,' +
        'studentId REFERENCES students(id) NOT NULL);');
    db.run(
        'CREATE TABLE IF NOT EXISTS classTeachers(' +
        'classId REFERENCES classes(id) ON DELETE CASCADE NOT NULL,' +
        'teacherId REFERENCES teachers(id) NOT NULL);');

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

function clear(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      transaction.exec('DELETE FROM classes;');
      transaction.exec('DELETE FROM classStudents;');
      transaction.exec('DELETE FROM classTeachers;');

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

function Class(name, startDate) {
  this.name = name;
  this.startDate = startDate;
  this.students = [];
  this.teachers = [];
}

Class.prototype.getId = function(name, startDate, callback) {
  db.serialize(function() {
    db.all(
        'SELECT * FROM classes WHERE name = ? AND startDate = ?;',
        [name, startDate], function(err, rows) {
          if (err) {
            console.log(colors.red(err.message));
            if (callback) callback([]);
          } else {
            if (callback) callback(rows);
          }
        });
  });
};

Class.prototype.insert = function(callback) {
  var c = this;
  db.serialize(function() {
    db.run(
        'INSERT INTO classes(name, startDate) VALUES(?, ?);',
        [c.name, c.startDate], function(err) {
          if (err) {
            console.log(colors.red(err.message));
            if (callback) callback(false);
          } else {
            db.all(
                'SELECT id FROM classes WHERE name = ? AND startDate = ?',
                [c.name, c.startDate], function(err, rows) {
                  if (err) {
                    console.log(colors.red(err.message));
                    if (callback) callback(false);
                  } else {
                    c.id = rows[rows.length - 1].id;
                    if (callback) callback(true);
                  }
                });
          }
        });
  });
};

Class.prototype.remove = function(callback) {
  var c = this;
  if (!c.id) {
    if (callback) callback(false);
  }
  db.serialize(function() {
    db.run('DELETE FROM classes WHERE id = ?', [c.id], function(err) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback(false);
      } else {
        if (callback) callback(true);
      }
    });
  });
};

Class.prototype.edit = function(newName, newStartDate, callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          'UPDATE classes SET name = ?, startDate = ? WHERE id = ?',
          [newName, newStartDate, id], function(err) {
            if (err) {
              console.error(colors.red(err.message));
              if (callback) callback(false);
            } else {
              if (callback) callback(true);
            }
          });
    });
  }
};

Class.prototype.addStudents = function(students, callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      var stmt = db.prepare('INSERT INTO classStudents VALUES(?, ?)');
      for (var i = 0; i < students.length; ++i) {
        stmt.run([id, students[i].id]);
      }
      stmt.finalize(function(err) {
        if (err) {
          console.log(colors.red(err.message));
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      });
    });
  }
};

Class.prototype.removeStudents = function(students, callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      var stmt = db.prepare(
          'DELETE FROM classStudents ' +
          'WHERE classId = ? AND studentId = ?;');
      for (var i = 0; i < students.length; ++i) {
        stmt.run([id, students[i].id]);
      }
      stmt.finalize(function(err) {
        if (err) {
          console.log(colors.red(err.message));
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      });
    });
  }
};

Class.prototype.getStudents = function(callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback([]);
  } else {
    db.serialize(function() {
      db.all(
          'SELECT * FROM students WHERE id IN ' +
              '(SELECT studentId FROM classStudents WHERE classId = ?)',
          [id], function(err, rows) {
            if (err) {
              console.error(colors.red(err.message));
              if (callback) callback([]);
            } else {
              if (callback) callback(rows);
            }
          });
    });
  }
};

Class.prototype.addTeachers = function(teachers, callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      var stmt = db.prepare('INSERT INTO classTeachers VALUES(?, ?)');
      for (var i = 0; i < teachers.length; ++i) {
        stmt.run([id, teachers[i].id]);
      }
      stmt.finalize(function(err) {
        if (err) {
          console.log(colors.red(err.message));
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      });
    });
  }
};

Class.prototype.removeTeachers = function(teachers, callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      var stmt = db.prepare(
          'DELETE FROM classTeachers ' +
          'WHERE classId = ? AND teacherId = ?;');
      for (var i = 0; i < teachers.length; ++i) {
        stmt.run([id, teachers[i].id]);
      }
      stmt.finalize(function(err) {
        if (err) {
          console.log(colors.red(err.message));
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      });
    });
  }
};

Class.prototype.getTeachers = function(callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback([]);
  } else {
    db.serialize(function() {
      db.all(
          'SELECT * FROM teachers WHERE id IN ' +
              '(SELECT teacherId FROM classTeachers WHERE classId = ?)',
          [id], function(err, rows) {
            if (err) {
              console.error(colors.red(err.message));
              if (callback) callback([]);
            } else {
              if (callback) callback(rows);
            }
          });
    });
  }
};

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  clear: clear,
  Class: Class,
};
