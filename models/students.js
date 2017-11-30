var db = require('./db_helper');
var colors = require('colors');
var faker = require('faker');
var path = require('path');
var fs = require('fs');

function migrate() {
  db.serialize(function() {
    db.run(
        'CREATE TABLE IF NOT EXISTS students(' +
        'id TEXT PRIMARY KEY, ' +
        'name TEXT NOT NULL);');
    db.run(
        'CREATE TABLE IF NOT EXISTS studentInfo(' +
        'studentId TEXT REFERENCES students(id) ON DELETE CASCADE NOT NULL,' +
        'gender TEXT,' +
        'birthday INTEGER,' +
        'socialId TEXT,' +
        'marriage TEXT,' +
        'address TEXT,' +
        'phone TEXT,' +
        'email TEXT);');
    db.run(
        'CREATE TABLE IF NOT EXISTS studentExtraInfo(' +
        'studentId TEXT REFERENCES students(id) ON DELETE CASCADE NOT NULL,' +
        'career TEXT,' +
        'education TEXT,' +
        'religion TEXT,' +
        'illness TEXT,' +
        'emergencyContact TEXT,' +
        'emergencyContactPhone TEXT);');
    db.run(
        'CREATE TABLE IF NOT EXISTS studentHardCopy(' +
        'studentId TEXT REFERENCES students(id) ON DELETE CASCADE NOT NULL,' +
        'hardCopy BLOB);');
    console.log(colors.green('students migration done.'));
  });
}

function queryAll(callback) {
  db.serialize(function() {
    db.all(
        'SELECT s.id, s.name,' +
            'si.gender, ' +
            'si.birthday,' +
            'si.socialId,' +
            'si.marriage,' +
            'si.address,' +
            'si.phone,' +
            'si.email, ' +
            'sei.career,' +
            'sei.education,' +
            'sei.religion,' +
            'sei.illness,' +
            'sei.emergencyContact,' +
            'sei.emergencyContactPhone,' +
            'shc.hardCopy ' +
            'FROM students s ' +
            'LEFT JOIN studentInfo si ON s.id = si.studentId ' +
            'LEFT JOIN studentExtraInfo sei ON s.id = sei.studentId ' +
            'LEFT JOIN studentHardCopy shc ON s.id = shc.studentId;',
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

function clear(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      transaction.exec('DELETE FROM students;');
      transaction.exec('DELETE FROM studentInfo;');
      transaction.exec('DELETE FROM studentExtraInfo;');
      transaction.exec('DELETE FROM studentHardCopy;');

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

function Student(id, name) {
  this.id = id;
  this.name = name;
}

function BasicInfo(obj) {
  this.studentId = obj.studentId;
  this.gender = obj.gender;
  this.birthday = obj.birthday;
  this.socialId = obj.socialId;
  this.marriage = obj.marriage;
  this.address = obj.address;
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

function HardCopy(obj) {
  this.studentId = obj.studentId;
  this.hardCopy = obj.hardCopy;
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
  var id = this.id;
  var name = this.name;
  db.serialize(function() {
    db.run(
        'INSERT INTO students(id, name) VALUES(?, ?);', [id, name],
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

Student.prototype.addBasicInfo = function(basicInfo, callback) {
  var student = this;
  if (basicInfo.studentId !== this.id) {
    if (callback) callback(false);
  } else {
    db.serialize(function() {
      db.run(
          'INSERT INTO studentInfo VALUES(?, ?, ?, ?, ?, ?, ?, ?);',
          [
            student.id, basicInfo.gender, basicInfo.birthday,
            basicInfo.socialId, basicInfo.marriage, basicInfo.address,
            basicInfo.phone, basicInfo.email
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
  db.serialize(function() {
    db.run(
        'UPDATE studentInfo SET ' +
            'gender = ?,' +
            'birthday = ?,' +
            'socialId = ?,' +
            'marriage = ?,' +
            'address = ?,' +
            'phone = ?,' +
            'email = ? ' +
            'WHERE studentId = ?;',
        [
          basicInfo.gender, basicInfo.birthday, basicInfo.socialId,
          basicInfo.marriage, basicInfo.address, basicInfo.phone,
          basicInfo.email, id
        ],
        function(err) {
          if (err) {
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
};

Student.prototype.remove = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
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
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
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
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
};

Student.prototype.addHardCopy = function(hardCopy, callback) {
  var id = this.id;
  db.serialize(function() {
    db.run(
        'INSERT INTO studentHardCopy VALUES(?, ?);', [id, hardCopy.hardCopy],
        function(err) {
          if (err) {
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
};

Student.prototype.getHardCopy = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.get(
        'SELECT * FROM studentHardCopy WHERE studentId = ?;', [id],
        function(err, row) {
          if (err) {
            if (callback) callback({});
          } else {
            if (callback) callback(row);
          }
        });
  });
};

Student.prototype.updateHardCopy = function(hardCopy, callback) {
  var id = this.id;
  db.serialize(function() {
    db.run(
        'UPDATE studentHardCopy SET ' +
            'hardCopy = ? ' +
            'WHERE studentId = ?;',
        [hardCopy.hardCopy, id], function(err) {
          if (err) {
            if (callback) callback(false);
          } else {
            if (callback) callback(true);
          }
        });
  });
};

function generateStudents(num, callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      var fileData = fs.readFileSync(
          path.join(
              'node_modules', 'node-gallery', 'examples', 'resources',
              'photos', 'Ireland', 'East Coast', 'MG_0367.jpg'));

      for (var i = 0; i < num; ++i) {
        var id = faker.random.uuid();
        var name = faker.name.firstName() + ' ' + faker.name.lastName();
        transaction.run('INSERT INTO students VALUES(?, ?);', [id, name]);

        transaction.run(
            'INSERT INTO studentInfo ' +
                'VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
            [

              id,
              faker.random.boolean() ? '男' : '女',
              faker.date.between('1900-01-01', '2016-12-31'),
              'Z' + faker.random.number({min: 100000000, max: 999999999}),
              faker.random.boolean() ? '已婚' : '單生',
              faker.address.streetAddress('###'),
              faker.phone.phoneNumberFormat(1),
              faker.internet.email(),
            ]);
        transaction.run(
            'INSERT INTO studentExtraInfo VALUES(?, ?, ?, ?, ?, ?, ?);', [
              id,
              faker.name.jobTitle(),
              faker.random.boolean() ? '高中以下' : '大學畢業',
              faker.random.boolean() ? '基督教' : '天主教',
              faker.random.boolean() ? '無' : '感冒',
              faker.random.boolean() ? '母' : '父',
              faker.phone.phoneNumberFormat(1),
            ]);

        transaction.run(
            'INSERT INTO studentHardCopy VALUES(?, ?);', [id, fileData]);
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
  });
}

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  getBasicInfo: getBasicInfo,
  clear: clear,
  Student: Student,
  BasicInfo: BasicInfo,
  ExtraInfo: ExtraInfo,
  HardCopy: HardCopy,
  generateStudents: generateStudents,
};
