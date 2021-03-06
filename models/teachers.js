var db = require('./db_helper');
var colors = require('colors');
var faker = require('faker');
var path = require('path');
var fs = require('fs');

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
            console.error(colors.red(err.message));
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
    if (callback) callback({});
  } else {
    var id = this.id;
    db.serialize(function() {
      db.get('SELECT * FROM teachers WHERE id = ?;', [id], function(err, row) {
        if (err) {
          console.error(colors.red(err.message));
          if (callback) callback({});
        } else {
          if (callback) callback(row);
        }
      });
    });
  }
};

Teacher.prototype.changeName = function(newName, callback) {
  if (!this.id) {
    if (callback) callback(false);
  } else {
    this.name = newName;
    var id = this.id;
    db.serialize(function() {
      db.get(
          'UPDATE teachers SET name = ? WHERE id = ?;', [newName, id],
          function(err) {
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

Teacher.prototype.insert = function(callback) {
  var teacher = this;
  db.serialize(function() {
    db.run(
        'INSERT INTO teachers(name) VALUES(?);', [teacher.name],
        function(err) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          } else {
            db.all(
                'SELECT id FROM teachers WHERE name = ?;', [teacher.name],
                function(err, rows) {
                  if (err) {
                    console.error(colors.red(err.message));
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

Teacher.prototype.remove = function(callback) {
  var teacher = this;
  if (teacher.id) {
    db.serialize(function() {
      db.run(
          'DELETE FROM teachers WHERE id = ?;', [teacher.id], function(err) {
            if (err) {
              console.error(colors.red(err.message));
              if (callback) callback(false);
            } else {
              if (callback) callback(true);
            }
          });
    });
  } else {
    if (callback) callback(false);
  }
};

Teacher.prototype.addBasicInfo = function(basicInfo, callback) {
  var id = this.id;
  if (id !== basicInfo.teacherId) {
    if (callback) callback(false);
  } else {
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
              console.error(colors.red(err.message));
              if (callback) callback(false);
            } else {
              if (callback) callback(true);
            }
          });
    });
  }
};

Teacher.prototype.getId = function(callback) {
  var name = this.name;
  db.serialize(function() {
    db.all(
        'SELECT id FROM teachers WHERE name = ?;', [name],
        function(err, rows) {
          if (err) {
            console.error(colors.red(err.message));
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
              console.error(err.message);
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
  if (id !== basicInfo.teacherId) {
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
              console.error(err.message);
              if (callback) callback(false);
            } else {
              if (callback) callback(true);
            }
          });
    });
  }
};

function generateTeachers(num, callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback(false);
      } else {
        var fileData = fs.readFileSync(
            path.join(
                'node_modules', 'node-gallery', 'examples', 'resources',
                'photos', 'Ireland', 'East Coast', 'MG_0367.jpg'));

        var names = [];
        for (var i = 0; i < num; ++i) {
          var name = faker.name.firstName() + ' ' + faker.name.lastName();
          names.push(name);
          transaction.run('INSERT INTO teachers(name) VALUES(?)', [name]);
        }

        transaction.commit(function(err) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          } else {
            var query = 'SELECT id FROM teachers WHERE name IN (';
            for (var i = 0; i < names.length; ++i) {
              query += '"' + names[i] + '"';
              if (i !== names.length - 1) query += ', ';
            }
            query += ');';
            db.all(query, function(err, teacherIds) {
              if (err) {
                console.error(colors.red(err.message));
                if (callback) callback(false);
              } else {
                db.beginTransaction(function(err, transaction) {
                  for (var i = 0; i < teacherIds.length; ++i) {
                    transaction.run(
                        'INSERT INTO teacherInfo ' +
                            'VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                        [

                          teacherIds[i].id,
                          faker.random.boolean() ? '男' : '女',
                          faker.date.between('1900-01-01', '2016-12-31'),
                          'Z' +
                              faker.random.number(
                                  {min: 100000000, max: 999999999}),
                          faker.random.boolean() ? '已婚' : '單生',
                          faker.address.streetAddress('###'),
                          faker.phone.phoneNumberFormat(1),
                          faker.internet.email(),
                        ]);
                  }
                  transaction.commit(function(err) {
                    if (err) {
                      console.error(colors.red(err.message));
                      if (callback) callback(false);
                    } else {
                      if (callback) callback(true);
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  });
}

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  clear: clear,
  generateTeachers: generateTeachers,
  Teacher: Teacher,
  BasicInfo: BasicInfo,
};
