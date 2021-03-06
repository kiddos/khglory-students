var faker = require('faker');
var request = require('request');
var path = require('path');
var fs = require('fs');

var students = require('../../models/students');

describe('Student', function() {
  beforeAll(function(done) {
    students.migrate(function(status) {
      expect(status).toBe(true);
      done();
    });
  });

  it('Should be able to be created', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

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

  it('Should not be able to be created if name not given', function(done) {
    var student = new students.Student(null);

    student.insert(function(status) {
      expect(status).toBe(false);
      done();
    });
  });

  it('Should be able to create multiple', function(done) {
    var maxCount = 600;
    var index = 0;
    var studentData = [];
    var insert = function() {
      var name = faker.name.firstName() + ' ' + faker.name.lastName();
      var student = new students.Student(name);
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
  }, 100000);

  it('Should be able to be deleted', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

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

  it('should be found with given id', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

    student.insert(function(status) {
      student.find(function(studentData) {
        var keys = Object.keys(studentData);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          expect(student[key]).toBe(studentData[key]);
        }
        done();
      });
    });
  });

  it('Should not be found with incorrect id', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

    student.insert(function(status) {
      student.id = 'random id';
      student.find(function(studentData) {
        expect(studentData).toBe(undefined);
        done();
      });
    });
  });

  it('Should be able to be removed', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

    student.insert(function(status) {
      expect(status).toBe(true);
      student.remove(function(status) {
        expect(status).toBe(true);

        students.queryAll(function(studentData) {
          var found = false;
          for (var i = 0; i < studentData.length; ++i) {
            found = (studentData[i].id === student.id);
          }
          expect(found).toBe(false);
          done();
        });
      });
    });
  });

  it('Should be able to change name', function(done) {
    var name = faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

    student.insert(function(status) {
      var newName = faker.name.firstName() + ' ' + faker.name.lastName();
      student.changeName(newName, function(status) {
        expect(status).toBe(true);
        student.find(function(studentData) {
          expect(studentData.name).toBe(newName);
          done();
        });
      });
    });
  });

  it('Should be able generate lots of students', function(done) {
    var num = 1000;
    students.generateStudents(num, function(status) {
      expect(status).toBe(true);
      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBe(num);
        done();
      });
    });
  }, 100000);

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
  beforeEach(function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

    student.insert(function(status) {
      expect(status).toBe(true);
      done();
    });
  });

  it('Should be able to be added', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? 1 : 0,
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        city: faker.address.streetAddress('###'),
        region: faker.address.streetAddress('###'),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        student.getBasicInfo(function(info) {
          for (var i = 0; i < Object.keys(info).length; ++i) {
            var key = Object.keys(info)[i];
            expect(info[key]).toBe(
                basicInfo[key] !== undefined ? basicInfo[key] : null);
          }
          done();
        });
      });
    });
  });

  it('Should not be able to be added with incorrect id', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var basicInfo = new students.BasicInfo({
        studentId: faker.random.uuid(),
        gender: faker.random.boolean() ? 1 : 0,
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        address: faker.address.streetAddress('###'),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(false);
        done();
      });
    });
  });

  it('Should be able to be added with partial info', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? 1 : 0,
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        city: faker.address.streetAddress('###'),
        region: faker.address.streetAddress('###'),
        street: faker.address.streetAddress('###'),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      var keys = Object.keys(basicInfo);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== 'studentId') {
          if (faker.random.boolean()) {
            basicInfo[key] = null;
          }
        }
      }
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        student.getBasicInfo(function(basicInfoData) {
          var keys = Object.keys(basicInfo);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            expect(basicInfo[key]).toBe(basicInfoData[key]);
          }
          done();
        });
      });
    });
  });

  it('Should be able to be updated', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? 1 : 0,
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);

        var newBasicInfo = new students.BasicInfo({
          studentId: student.id,
          gender: faker.random.boolean() ? 1 : 0,
          birthday: new Date().getTime(),
          socialId:
              'A' + faker.random.number({min: 100000000, max: 999999999}),
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
              expect(info[key]).toBe(
                  newBasicInfo[key] !== undefined ? newBasicInfo[key] : null);
            }
            done();
          });
        });
      });
    });
  });

  it('Should not be able to be updated with incorrect id', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? 1 : 0,
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
          studentId: faker.random.uuid(),
          gender: faker.random.boolean() ? 1 : 0,
          birthday: new Date().getTime(),
          socialId:
              'A' + faker.random.number({min: 100000000, max: 999999999}),
          marriage: faker.random.boolean() ? '已婚' : '單身',
          address: faker.address.streetAddress('###'),
          phone: faker.phone.phoneNumberFormat(1),
          email: faker.internet.email(),
        });
        student.updateBasicInfo(newBasicInfo, function(status) {
          expect(status).toBe(false);
          done();
        });
      });
    });
  });

  it('Should be deleted when the student is removed', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: faker.random.boolean() ? 1 : 0,
        birthday: new Date().getTime(),
        socialId: 'A' + faker.random.number({min: 100000000, max: 999999999}),
        marriage: faker.random.boolean() ? '已婚' : '單身',
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);

        student.remove(function(status) {
          expect(status).toBe(true);
          students.getBasicInfo(function(basicInfos) {
            var found = false;
            for (var i = 0; i < basicInfos.length; ++i) {
              found = (basicInfos[i].studentId === basicInfo.studentId);
            }
            expect(found).toBe(false);
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
  beforeEach(function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

    student.insert(function(status) {
      expect(status).toBe(true);
      done();
    });
  });

  it('Should be able to be added', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

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

  it('Should not be able to be added with incorrect id', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var extraInfo = new students.ExtraInfo({
        studentId: faker.random.uuid(),
        career: faker.name.jobTitle(),
        education: faker.random.boolean() ? '大專畢業' : '碩博士',
        religion: faker.random.boolean() ? '基督教' : '佛教',
        illness: faker.random.boolean() ? '無' : '生病',
        emergencyContact: faker.random.boolean() ? '父' : '母',
        emergencyContactPhone: faker.phone.phoneNumberFormat(1),
      });
      student.addExtraInfo(extraInfo, function(status) {
        expect(status).toBe(false);
        done();
      });
    });
  });

  it('Should be able to be added with partial info', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: faker.name.jobTitle(),
        education: faker.random.boolean() ? '大專畢業' : '碩博士',
        religion: faker.random.boolean() ? '基督教' : '佛教',
        illness: faker.random.boolean() ? '無' : '生病',
        emergencyContact: faker.random.boolean() ? '父' : '母',
        emergencyContactPhone: faker.phone.phoneNumberFormat(1),
      });
      var keys = Object.keys(extraInfo);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== 'studentId') {
          if (faker.random.boolean()) {
            extraInfo[key] = null;
          }
        }
      }
      student.addExtraInfo(extraInfo, function(status) {
        expect(status).toBe(true);
        student.getExtraInfo(function(extraInfoData) {
          var keys = Object.keys(extraInfoData);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            expect(extraInfo[key]).toBe(extraInfoData[key]);
          }
          done();
        });
      });
    });
  });

  it('Should be able to be updated', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

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

  it('Should be not be able to be updated with incorrect id', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

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
          studentId: faker.random.uuid(),
          career: faker.name.jobTitle(),
          education: faker.random.boolean() ? '大專畢業' : '碩博士',
          religion: faker.random.boolean() ? '基督教' : '佛教',
          illness: faker.random.boolean() ? '無' : '生病',
          emergencyContact: faker.random.boolean() ? '父' : '母',
          emergencyContactPhone: faker.phone.phoneNumberFormat(1),
        });
        student.updateExtraInfo(newExtraInfo, function(status) {
          expect(status).toBe(false);
          done();
        });
      });
    });
  });

  it('Should be deleted when the student is removed', function(done) {
    students.queryAll(function(allStudents) {
      var student = new students.Student(allStudents[0].name);
      student.id = allStudents[0].id;

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

        student.remove(function(status) {
          expect(status).toBe(true);
          students.getExtraInfo(function(extraInfos) {
            var found = false;
            for (var i = 0; i < extraInfos.length; ++i) {
              found = (extraInfos[i].studentId === extraInfo.studentId);
            }
            expect(found).toBe(false);
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
