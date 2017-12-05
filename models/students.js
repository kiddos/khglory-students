var db = require('./db_helper');
var colors = require('colors');
var faker = require('faker');
var path = require('path');
var fs = require('fs');

var cities = require('./cities');

function migrate(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback(false);
      } else {
        transaction.run(`CREATE TABLE IF NOT EXISTS students(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL);`);

        transaction.run(`CREATE TABLE IF NOT EXISTS studentInfo(
          studentId INTEGER REFERENCES students(id) ON DELETE CASCADE NOT NULL,
          gender INTEGER,
          birthday INTEGER,
          socialId TEXT,
          marriage TEXT,
          city TEXT,
          region TEXT,
          street TEXT,
          phone TEXT,
          email TEXT);`);

        transaction.run(`CREATE TABLE IF NOT EXISTS studentExtraInfo(
          studentId INTEGER REFERENCES students(id) ON DELETE CASCADE NOT NULL,
          career TEXT,
          education TEXT,
          religion TEXT,
          illness TEXT,
          emergencyContact TEXT,
          emergencyContactPhone TEXT);`);

        transaction.commit(function(err) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          } else {
            console.log(colors.green('students migration done.'));
            if (callback) callback(true);
          }
        });
      }
    });
  });
}

function queryAll(callback) {
  db.serialize(function() {
    db.all(
        `SELECT
          s.id,
          s.name,
          si.gender,
          si.birthday,
          si.socialId,
          si.marriage,
          si.city,
          si.phone,
          si.email,
          sei.career,
          sei.education,
          sei.religion,
          sei.illness,
          sei.emergencyContact,
          sei.emergencyContactPhone
          FROM students s
          LEFT JOIN studentInfo si ON s.id = si.studentId
          LEFT JOIN studentExtraInfo sei ON s.id = sei.studentId;`,
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

function getBasicInfo(callback) {
  db.serialize(function() {
    db.all('SELECT * FROM studentInfo;', function(err, rows) {
      if (err) {
        console.log(colors.red(err.message));
        callback([]);
      } else {
        callback(rows);
      }
    });
  });
}

function getExtraInfo(callback) {
  db.serialize(function() {
    db.all('SELECT * FROM studentExtraInfo;', function(err, rows) {
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
      transaction.exec('DELETE FROM students;');
      transaction.exec('DELETE FROM studentInfo;');
      transaction.exec('DELETE FROM studentExtraInfo;');

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

function Student(name) {
  this.name = name;
}

function BasicInfo(obj) {
  this.studentId = obj.studentId;
  this.gender = obj.gender;
  this.birthday = obj.birthday;
  this.socialId = obj.socialId;
  this.marriage = obj.marriage;
  this.city = obj.city;
  this.region = obj.region;
  this.street = obj.street;
  this.phone = obj.phone;
  this.email = obj.email;
}

function ExtraInfo(obj) {
  this.studentId = obj.studentId;
  this.career = obj.career;
  this.education = obj.education;
  this.religion = obj.religion;
  this.illness = obj.illness;
  this.emergencyContact = obj.emergencyContact;
  this.emergencyContactPhone = obj.emergencyContactPhone;
}

Student.prototype.find = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.get('SELECT * FROM students WHERE id = ?;', [id], function(err, row) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback(null);
      } else {
        if (callback) callback(row);
      }
    });
  });
};

Student.prototype.changeName = function(newName, callback) {
  var id = this.id;
  db.serialize(function() {
    db.run(
        'UPDATE students SET name = ? WHERE id = ?;', [newName, id],
        function(err) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
};

Student.prototype.insert = function(callback) {
  var student = this;
  db.serialize(function() {
    db.run(
        'INSERT INTO students(name) VALUES(?);', [student.name],
        function(err) {
          if (err) {
            console.log(colors.red(err.message));
            if (callback) callback(false);
          } else {
            db.all(
                `SELECT id FROM students WHERE name = ?;`, [student.name],
                function(err, rows) {
                  if (err) {
                    console.log(colors.red(err.message));
                    if (callback) callback(false);
                  } else {
                    student.id = rows[rows.length - 1].id;
                    if (callback) callback(true);
                  }
                });
          }
        });
  });
};

Student.prototype.addBasicInfo = function(basicInfo, callback) {
  var student = this;
  if (basicInfo.studentId !== this.id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          'INSERT INTO studentInfo VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
          [
            student.id, basicInfo.gender, basicInfo.birthday,
            basicInfo.socialId, basicInfo.marriage, basicInfo.city,
            basicInfo.region, basicInfo.street, basicInfo.phone,
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

Student.prototype.getBasicInfo = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.get(
        'SELECT * FROM studentInfo WHERE studentId = ?;', [id],
        function(err, row) {
          if (err) {
            if (callback) callback({});
          } else {
            if (callback) callback(row);
          }
        });
  });
};

Student.prototype.updateBasicInfo = function(basicInfo, callback) {
  var id = this.id;
  if (id !== basicInfo.studentId) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          `UPDATE studentInfo SET
              gender = ?,
              birthday = ?,
              socialId = ?,
              marriage = ?,
              city = ?,
              region = ?,
              street = ?,
              phone = ?,
              email = ?
              WHERE studentId = ?;`,
          [
            basicInfo.gender, basicInfo.birthday, basicInfo.socialId,
            basicInfo.marriage, basicInfo.city, basicInfo.region,
            basicInfo.street, basicInfo.phone, basicInfo.email, id
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

Student.prototype.remove = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.run('DELETE FROM students WHERE id = ?;', [id], function(err) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback(false);
      } else {
        if (callback) callback(true);
      }
    });
  });
};

Student.prototype.addExtraInfo = function(extraInfo, callback) {
  var id = this.id;
  if (id !== extraInfo.studentId) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          'INSERT INTO studentExtraInfo VALUES(?, ?, ?, ?, ?, ?, ?);',
          [
            id, extraInfo.career, extraInfo.education, extraInfo.religion,
            extraInfo.illness, extraInfo.emergencyContact,
            extraInfo.emergencyContactPhone
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

Student.prototype.getExtraInfo = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.get(
        'SELECT * FROM studentExtraInfo WHERE studentId = ?;', [id],
        function(err, row) {
          if (err) {
            if (callback) callback({});
          } else {
            if (callback) callback(row);
          }
        });
  });
};

Student.prototype.updateExtraInfo = function(extraInfo, callback) {
  var id = this.id;
  if (id !== extraInfo.studentId) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          'UPDATE studentExtraInfo SET ' +
              'career = ?,' +
              'education = ?,' +
              'religion = ?,' +
              'illness = ?,' +
              'emergencyContact = ?,' +
              'emergencyContactPhone = ? ' +
              'WHERE studentId = ?;',
          [
            extraInfo.career, extraInfo.education, extraInfo.religion,
            extraInfo.illness, extraInfo.emergencyContact,
            extraInfo.emergencyContactPhone, id
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

function generateStudents(num, callback) {
  var city = new cities.City('高雄');
  city.id = 1;
  city.getRegions(function(regions) {
    db.serialize(function() {
      db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < num; ++i) {
          var name = faker.name.firstName() + ' ' + faker.name.lastName();
          transaction.run('INSERT INTO students(name) VALUES(?);', [name]);
        }

        transaction.commit(function(err) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          } else {
            queryAll(function(studentData) {
              db.beginTransaction(function(err, transaction) {
                if (err) {
                  console.error(colors.red(err.message));
                  if (callback) callback(false);
                } else {
                  for (var i = 0; i < studentData.length / 2; ++i) {
                    transaction.run(
                        `INSERT INTO studentInfo
                          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        [
                          studentData[i].id,
                          faker.random.boolean() ? 1 : 0,
                          faker.date.between('1900-01-01', '2016-12-31'),
                          'Z' +
                              faker.random.number(
                                  {min: 100000000, max: 999999999}),
                          faker.random.boolean() ? '已婚' : '單生',
                          city.name,
                          regions[faker.random.number({min: 0, max: 37})],
                          faker.address.streetAddress('###'),
                          faker.phone.phoneNumberFormat(1),
                          faker.internet.email(),
                        ]);
                    transaction.run(
                        `INSERT INTO studentExtraInfo
                          VALUES(?, ?, ?, ?, ?, ?, ?);`,
                        [
                          studentData[i].id,
                          faker.name.jobTitle(),
                          faker.random.boolean() ? '高中以下' : '大學畢業',
                          faker.random.boolean() ? '基督教' : '天主教',
                          faker.random.boolean() ? '無' : '感冒',
                          faker.random.boolean() ? '母' : '父',
                          faker.phone.phoneNumberFormat(1),
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
                }
              });
            });
          }
        });
      });
    });
  });
}

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  getBasicInfo: getBasicInfo,
  getExtraInfo: getExtraInfo,
  clear: clear,
  Student: Student,
  BasicInfo: BasicInfo,
  ExtraInfo: ExtraInfo,
  generateStudents: generateStudents,
};
