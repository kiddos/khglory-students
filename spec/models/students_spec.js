var faker = require('faker');
var request = require('request');
var fs = require('fs');

var students = require('../../models/students');

students.migrate();

describe('Student Model', function() {
  it('Should be able to create and delete', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);
      students.queryAll(function(data) {
        expect(data.length).toBe(1);
        expect(data[0].id).toBe(student.id);
        expect(data[0].name).toBe(student.name);
        done();
      });
    });
  }, 10000);

  it('Should be able to create multiple', function(done) {
    var maxCount = 1000;
    var index = 0;
    var studentData = [];
    var insert = function() {
      var name = faker.name.firstName() + ' ' + faker.name.lastName();
      var student = new students.Student(faker.random.uuid(), name);
      studentData.push(student);

      if (index < maxCount) {
        index += 1;
        student.insert(insert);
      } else {
        students.queryAll(function(data) {
          var found = 0;
          for (var i = 0; i < maxCount; ++i) {
            for (var j = 0; j < data.length; ++j) {
              if (data[j].id === studentData[i].id &&
                  data[j].name === studentData[i].name) {
                found += 1;
                break;
              }
            }
          }
          expect(found).toBe(maxCount);
          done();
        });
      }
    };
    insert();
  }, 10000);

  it('Should be able to be deleted', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);
      student.remove(function(status) {
        expect(status).toBe(true);
        students.queryAll(function(allStudents) {
          expect(allStudents.length).toBe(0);
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    students.clear(function(status) {
      expect(status).toBe(true);
      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBe(0);
        done();
      });
    });
  });
});

describe('Student BasicInfo', function() {
  it('Should be able to add BasicInfo', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);

      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? '男' : '女',
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        address: faker.address.streetAddress('###'),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        student.getBasicInfo(function(info) {
          for (var i = 0; i < Object.keys(info).length; ++i) {
            var key = Object.keys(info)[i];
            expect(info[key]).toBe(basicInfo[key]);
          }
          done();
        });
      });
    });
  });

  it('Should be able to update its BasicInfo', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);
      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? '男' : '女',
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        address: faker.address.streetAddress('###'),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);

        var newBasicInfo = new students.BasicInfo({
          studentId: student.id,
          gender: faker.random.boolean() ? '男' : '女',
          birthday: new Date().getTime(),
          socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
          marriage: faker.random.boolean() ? '已婚' : '單身',
          address: faker.address.streetAddress('###'),
          phone: faker.phone.phoneNumberFormat(1),
          email: faker.internet.email(),
        });
        student.updateBasicInfo(newBasicInfo, function(status) {
          expect(status).toBe(true);
          student.getBasicInfo(function(info) {
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(newBasicInfo[key]);
            }
            done();
          });
        });
      });
    });
  });

  afterEach(function(done) {
    students.clear(function(status) {
      expect(status).toBe(true);
      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBe(0);
        done();
      });
    });
  });
});

describe('Student ExtraInfo', function() {
  it('Should be able to add ExtraInfo', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);
      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: faker.name.jobTitle(),
        education: faker.random.boolean() ? '大專畢業' : '碩博士',
        religion: faker.random.boolean() ? '基督教' : '佛教',
        illness: faker.random.boolean() ? '無' : '生病',
        emergencyContact: faker.random.boolean() ? '父' : '母',
        emergencyContactPhone: faker.phone.phoneNumberFormat(1),
      });
      student.addExtraInfo(extraInfo, function(status) {
        expect(status).toBe(true);
        student.getExtraInfo(function(info) {
          for (var i = 0; i < Object.keys(info).length; ++i) {
            var key = Object.keys(info)[i];
            expect(info[key]).toBe(extraInfo[key]);
          }
          done();
        });
      });
    });
  });

  it('Should be able to update its ExtraInfo', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);
      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: faker.name.jobTitle(),
        education: faker.random.boolean() ? '大專畢業' : '碩博士',
        religion: faker.random.boolean() ? '基督教' : '佛教',
        illness: faker.random.boolean() ? '無' : '生病',
        emergencyContact: faker.random.boolean() ? '父' : '母',
        emergencyContactPhone: faker.phone.phoneNumberFormat(1),
      });
      student.addExtraInfo(extraInfo, function(status) {
        expect(status).toBe(true);
        var newExtraInfo = new students.ExtraInfo({
          studentId: student.id,
          career: faker.name.jobTitle(),
          education: faker.random.boolean() ? '大專畢業' : '碩博士',
          religion: faker.random.boolean() ? '基督教' : '佛教',
          illness: faker.random.boolean() ? '無' : '生病',
          emergencyContact: faker.random.boolean() ? '父' : '母',
          emergencyContactPhone: faker.phone.phoneNumberFormat(1),
        });
        student.updateExtraInfo(newExtraInfo, function(status) {
          expect(status).toBe(true);
          student.getExtraInfo(function(info) {
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(
                  newExtraInfo[key] === undefined ? null : newExtraInfo[key]);
            }
            done();
          });
        });
      });
    });
  });

  afterEach(function(done) {
    students.clear(function(status) {
      expect(status).toBe(true);
      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBe(0);
        done();
      });
    });
  });
});

function downloadImage(url, filename, callback) {
  request(url).pipe(fs.createWriteStream(filename)).on('close', function() {
    if (callback) callback();
  });
}

describe('Student HardCopy', function() {
  it('Should be able to add HardCopy', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);

    student.insert(function(status) {
      expect(status).toBe(true);

      var imageUrl = faker.image.image();
      var tempImagePath = 'temp.jpg';
      downloadImage(imageUrl, tempImagePath, function() {
        fs.readFile(tempImagePath, function(err, data) {
          if (err) throw err;

          var hardCopy = new students.HardCopy({
            studentId: student.id,
            hardCopy: data,
          });
          student.addHardCopy(hardCopy, function(status) {
            expect(status).toBe(true);
            student.getHardCopy(function(hc) {
              for (var i = 0; i < Object.keys(hc).length; ++i) {
                var key = Object.keys(hc)[i];
                if (typeof(hc[key]) === 'object') {
                  for (var j = 0; j < hc[key].length; ++j) {
                    expect(hc[key][j]).toBe(hardCopy[key][j]);
                  }
                } else {
                  expect(hc[key]).toBe(hardCopy[key]);
                }
              }

              fs.unlink(tempImagePath, function(err) {
                if (err) throw err;
                done();
              });
            });
          });
        });
      });
    });
  }, 20000);

  it('Should be able to update its HardCopy', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(faker.random.uuid(), name);
    student.insert(function(status) {
      expect(status).toBe(true);

      var imageUrl = faker.image.image();
      var tempImagePath = 'temp.jpg';
      downloadImage(imageUrl, tempImagePath, function() {
        fs.readFile(tempImagePath, function(err, data) {
          if (err) throw err;

          var hardCopy = new students.HardCopy({
            studentId: student.id,
            hardCopy: data,
          });

          student.addHardCopy(hardCopy, function(status) {
            expect(status).toBe(true);

            fs.unlink(tempImagePath, function(err) {
              if (err) throw err;

              var newImageUrl = faker.image.image();
              downloadImage(newImageUrl, tempImagePath, function() {
                fs.readFile(tempImagePath, function(err, data) {
                  if (err) throw err;

                  var newHardCopy = new students.HardCopy({
                    studentId: student.id,
                    hardCopy: data,
                  });
                  student.updateHardCopy(newHardCopy, function(status) {
                    expect(status).toBe(true);
                    student.getHardCopy(function(hc) {
                      for (var i = 0; i < Object.keys(hc).length; ++i) {
                        var key = Object.keys(hc)[i];
                        if (typeof(hc[key]) === 'object') {
                          for (var j = 0; j < hc[key].length; ++j) {
                            expect(hc[key][j]).toBe(newHardCopy[key][j]);
                          }
                        } else {
                          expect(hc[key]).toBe(newHardCopy[key]);
                        }
                      }

                      fs.unlink(tempImagePath, function(err) {
                        if (err) throw err;

                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }, 20000);

  afterEach(function(done) {
    students.clear(function(status) {
      expect(status).toBe(true);
      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBe(0);
        done();
      });
    });
  });
});
