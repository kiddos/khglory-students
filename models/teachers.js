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
        'teacherId INTEGER REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,' +
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
            'ti.email ' +
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

function Teacher(name) {
  this.name = name;
}

function BasicInfo(obj) {
  this.teacherId = obj.teacherId;
  this.gender = obj.gender;
  this.birthday = obj.birthday;
  this.socialId = obj.socialId;
  this.marriage = obj.marriage;
  this.address = obj.address;
  this.phone = obj.phone;
  this.email = obj.email;
}

Teacher.prototype.find = function(callback) {
  if (!this.id) {
    if (callback) callback(false);
  } else {
    var id = this.id;
    db.serialize(function() {
      db.all(
          'SELECT * FROM teachers WHERE id = ?;', [id], function(err, rows) {
            if (err) {
              console.log(colors.red(err.message));
              if (callback) callback([]);
            } else {
              if (callback) callback(rows);
            }
          });
    });
  }
};

Teacher.prototype.insert = function(callback) {
  var teacher = this;
  db.serialize(function() {
    db.run(
        'INSERT INTO teachers(name) VALUES(?);', [teacher.name],
        function(err) {
          if (err) {
            console.log(colors.red(err.message));
            if (callback) callback(false);
          } else {
            db.all(
                'SELECT id FROM teachers WHERE name = ?;', [teacher.name],
                function(err, rows) {
                  if (err) {
                    console.log(colors.red(err.message));
                    if (callback) callback(false);
                  } else {
                    teacher.id = rows[rows.length - 1].id;
                    if (callback) callback(true);
                  }
                });
          }
        });
  });
};

Teacher.prototype.addBasicInfo = function(basicInfo, callback) {
  var id = this.id;
  db.serialize(function() {
    db.run(
        'INSERT INTO teacherInfo VALUES(?, ?, ?, ?, ?, ?, ?, ?);',
        [
          id, basicInfo.gender, basicInfo.birthday, basicInfo.socialId,
          basicInfo.marriage, basicInfo.address, basicInfo.phone,
          basicInfo.email
        ],
        function(err) {
          if (err) {
            console.log(colors.red(err.message));
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
};

Teacher.prototype.getId = function(callback) {
  var name = this.name;
  db.serialize(function() {
    db.all(
        'SELECT id FROM teachers WHERE name = ?;', [name],
        function(err, rows) {
          if (err) {
            console.log(colors.red(err.message));
            if (callback) callback([]);
          } else {
            if (callback) callback(rows);
          }
        });
  });
};

Teacher.prototype.getBasicInfo = function(callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback({});
  } else {
    db.serialize(function() {
      db.get(
          'SELECT * FROM teacherInfo WHERE teacherId = ?;', [id],
          function(err, row) {
            if (err) {
              console.log(err.message);
              if (callback) callback({});
            } else {
              if (callback) callback(row);
            }
          });
    });
  }
};

Teacher.prototype.updateBasicInfo = function(basicInfo, callback) {
  var id = this.id;
  if (!id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          'UPDATE teacherInfo SET ' +
              'gender = ?,' +
              'birthday = ?,' +
              'socialId = ?,' +
              'marriage = ?,' +
              'address = ?,' +
              'phone = ?,' +
              'email = ? ' +
              'WHERE teacherId = ?;',
          [
            basicInfo.gender, basicInfo.birthday, basicInfo.socialId,
            basicInfo.marriage, basicInfo.address, basicInfo.phone,
            basicInfo.email, id
          ],
          function(err) {
            if (err) {
              console.log(err.message);
              if (callback) callback(false);
            } else {
              if (callback) callback(true);
            }
          });
    });
  }
};

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  clear: clear,
  Teacher: Teacher,
  BasicInfo: BasicInfo,
};
