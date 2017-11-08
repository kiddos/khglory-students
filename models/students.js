var db = require('./db_helper');
var settings = require('../settings');
var colors = require('colors');

function migrate() {
  db.serialize(function() {
    db.run(
        'CREATE TABLE IF NOT EXISTS students(' +
        'id TEXT PRIMARY KEY, ' +
        'name TEXT NOT NULL);');
    db.run(
        'CREATE TABLE IF NOT EXISTS studentInfo(' +
        'studentId REFERENCES students(id),' +
        'gender TEXT,' +
        'birthday INTEGER,' +
        'socialId TEXT,' +
        'marriage TEXT,' +
        'address TEXT,' +
        'phone TEXT,' +
        'email TEXT);');
    db.run(
        'CREATE TABLE IF NOT EXISTS studentExtraInfo(' +
        'studentId REFERENCES students(id),' +
        'career TEXT,' +
        'education TEXT,' +
        'religion TEXT,' +
        'illness TEXT,' +
        'emergencyContact TEXT,' +
        'emergencyContactPhone TEXT);');
    db.run(
        'CREATE TABLE IF NOT EXISTS studentHardCopy(' +
        'studentId REFERENCES students(id),' +
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
            'LEFT JOIN studentInfo si On s.id = si.studentId ' +
            'LEFT JOIN studentExtraInfo sei On s.id = sei.studentId ' +
            'LEFT JOIN studentHardCopy shc On s.id = shc.studentId;' + [],
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
  var name = this.name;
  db.serialize(function() {
    db.all(
        'SELECT FROM students WHERE name = ?;', [name], function(err, rows) {
          if (err) {
            if (callback) callback([]);
          } else {
            if (callback) callback(rows);
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
  var id = this.id;
  db.serialize(function() {
    db.run(
        'INSERT INTO studentInfo VALUES(?, ?, ?, ?, ?, ?, ?, ?);',
        [
          id, basicInfo.gender, basicInfo.birthday, basicInfo.socialId,
          basicInfo.marriage, basicInfo.address, basicInfo.phone,
          basicInfo.email
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

Student.prototype.getHardCopy = function(hardCopy, callback) {
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

module.exports = {
  migrate: migrate,
  queryAll: queryAll,
  clear: clear,
  Student: Student,
  BasicInfo: BasicInfo,
  ExtraInfo: ExtraInfo,
  HardCopy: HardCopy,
};
