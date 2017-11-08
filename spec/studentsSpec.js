var students = require('../models/students');

describe('Students Module', function() {
  it('Should be able to create', function(done) {
    var max = 3;
    var index = 0;
    var insert = function() {
      var student =
          new students.Student(String(index + 1), 'students' + (index + 1));
      if (index < max) {
        index += 1;
        student.insert(insert);
      } else {
        students.queryAll(function(data) {
          expect(data.length).toBe(max);
          students.clear();
          done();
        });
      }
    };
    insert();
  }, 10000);
});

describe('Student BasicInfo', function() {
  it('Should be able to add BasicInfo', function(done) {
    var student = new students.Student('001', '王小明');
    student.insert(function(status) {
      if (status) {
        var basicInfo = new students.BasicInfo({
          studentId: student.id,
          gender: 'male',
          birthday: new Date().toString(),
          socialId: 'A123456789',
          marriage: 'single',
          address: '中山一路',
          phone: '0912345678',
          email: 'a123456789@gmail.com',
        });
        student.addBasicInfo(basicInfo, function(status) {
          expect(status).toBe(true);
          student.getBasicInfo(function(info) {
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(basicInfo[key]);
            }
            students.clear();
            done();
          });
        });
      }
    });
  });

  it('Should be able to update its BasicInfo', function(done) {
    var student = new students.Student('001', '王小明');
    student.insert(function(status) {
      expect(status).toBe(true);
      var basicInfo = new students.BasicInfo({
        studentId: student.id,
        gender: 'male',
        birthday: new Date().toString(),
        socialId: 'A123456789',
        marriage: 'single',
        address: '中山一路',
        phone: '0912345678',
        email: 'a123456789@gmail.com',
      });
      student.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        var newBasicInfo = new students.BasicInfo({
          studentId: student.id,
          gender: 'female',
          birthday: new Date().toString(),
          socialId: 'A987654321',
          marriage: 'married',
          address: '中山二路',
          phone: '0987654321',
          email: 'a987654321@gmail.com',
        });
        student.updateBasicInfo(newBasicInfo, function(status) {
          expect(status).toBe(true);
          student.getBasicInfo(function(info) {
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(newBasicInfo[key]);
            }
            students.clear();
            done();
          });
        });
      });
    });
  });
});

describe('Student ExtraInfo', function() {
  it('Should be able to add ExtraInfo', function(done) {
    var student = new students.Student('002', '王大明');
    student.insert(function(status) {
      expect(status).toBe(true);
      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: '倒垃圾的',
        education: 'high school',
        religion: '佛教',
        illness: 'none',
        emergencyContact: '父',
        emergencyContactPhone: '0912121212',
      });
      student.addExtraInfo(extraInfo, function(status) {
        expect(status).toBe(true);
        student.getExtraInfo(function(info) {
          for (var i = 0; i < Object.keys(info).length; ++i) {
            var key = Object.keys(info)[i];
            expect(info[key]).toBe(extraInfo[key]);
          }
          students.clear();
          done();
        });
      });
    });
  });

  it('Should be able to update its ExtraInfo', function() {
    var student = new students.Student('003', '王小明');
    student.insert(function(status) {
      expect(status).toBe(true);
      var extraInfo = new students.ExtraInfo({
        studentId: student.id,
        career: '洗碗工',
        education: 'university',
        religion: '天主教',
        illness: 'none',
        emergencyContact: '母',
        emergencyContactPhone: '0934343434',
      });
      student.addExtraInfo(extraInfo, function(status) {
        expect(status).toBe(true);
        var newExtraInfo = new students.ExtraInfo({
          studentId: student.id,
          career: 'jobless',
          education: '碩士',
          religion: '天主教',
          illness: 'none',
        });
        student.updateExtraInfo(newExtraInfo, function(status) {
          expect(status).toBe(true);
          student.getExtraInfo(function(info) {
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(newExtraInfo[key]);
            }
            students.clear();
            done();
          });
        });
      });
    });
  });
});

describe('Student HardCopy', function() {
  it('Should be able to add HardCopy', function() {
    var student = new students.Student('004', '王大明');
    student.insert(function(status) {
      expect(status).toBe(true);
      var hardCopy = new students.HardCopy({
        studentId: student.id,
        hardCopy: new Buffer([0, 0, 0, 1, 1, 1]),
      });
      student.addHardCopy(hardCopy, function(status) {
        expect(status).toBe(true);
        student.getHardCopy(function(info) {
          for (var i = 0; i < Object.keys(info).length; ++i) {
            var key = Object.keys(info)[i];
            expect(info[key]).toBe(hardCopy[key]);
          }
          students.clear();
          done();
        });
      });
    });
  });

  it('Should be able to update its HardCopy', function() {
    var student = new students.Student('005', '王小明');
    student.insert(function(status) {
      expect(status).toBe(true);
      var hardCopy = new students.HardCopy({
        studentId: student.id,
        hardCopy: new Buffer([0, 0, 0, 0, 0, 0]),
      });
      student.addHardCopy(hardCopy, function(status) {
        expect(status).toBe(true);
        var newHardCopy = new students.HardCopy({
          studentId: student.id,
          hardCopy: new Buffer([1, 1, 1, 1, 1, 1]),
        });
        student.updateHardCopy(newHardCopy, function(status) {
          expect(status).toBe(true);
          student.getHardCopy(function(info) {
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(newHardCopy[key]);
            }
            students.clear();
            done();
          });
        });
      });
    });
  });
});
