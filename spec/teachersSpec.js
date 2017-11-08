var teachers = require('../models/teachers');

describe('Teacher Model', function() {
  it('Shoudl be able to create', function(done) {
    var teacher = new teachers.Teacher('老吳');
    teacher.insert(function(status) {
      expect(status).toBe(true);
      expect(teacher.id).not.toBe(undefined);
      teachers.clear(function() {
        done();
      });
    });
  });

  it('Should be able to create mutiple', function(done) {
    var max = 20;
    var index = 0;
    var insert = function() {
      var teacher = new teachers.Teacher('teacher' + (index + 1));
      if (index < max) {
        index += 1;
        teacher.insert(insert);
      } else {
        teachers.queryAll(function(data) {
          expect(data.length).toBe(max);

          var found = 0;
          for (var i = 0; i < max; ++i) {
            for (var j = 0; j < data.length; ++j) {
              if (data[j].name === ('teacher' + (i + 1))) found += 1;
            }
          }
          expect(found).toBe(max);
          teachers.clear(function() {
            done();
          });
        });
      }
    };
    insert();
  }, 10000);
});

describe('Teacher BasicInfo Model', function() {
  it('Should be able to add BasicInfo', function(done) {
    var teacher = new teachers.Teacher('王老先生');
    teacher.insert(function(status) {
      expect(status).toBe(true);
      expect(teacher.id).not.toBe(undefined);

      var basicInfo = new teachers.BasicInfo({
        teacherId: teacher.id,
        gender: 'male',
        birthday: new Date().toString(),
        socialId: 'A123456789',
        address: '中山一路',
        phone: '0912345678',
        email: 'a123456789@gmail.com',
      });
      teacher.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        teacher.getBasicInfo(function(info) {
          expect(Object.keys(info).length).not.toBe({});
          for (var i = 0; i < Object.keys(info).length; ++i) {
            var key = Object.keys(info)[i];
            expect(info[key]).toBe(
                basicInfo[key] === undefined ? null : basicInfo[key]);
          }
          teachers.clear(function() {
            done();
          });
        });
      });
    });
  });

  it('Should be able to update its BasicInfo', function(done) {
    var teacher = new teachers.Teacher('王老太太');
    teacher.insert(function(status) {
      expect(status).toBe(true);

      var basicInfo = new teachers.BasicInfo({
        teacherId: teacher.id,
        gender: 'female',
        birthday: new Date().toString(),
        socialId: 'A123456789',
        phone: '0912345678',
        email: 'a123456789@gmail.com',
      });
      teacher.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);

        var newBasicInfo = new teachers.BasicInfo({
          teacherId: teacher.id,
          birthday: new Date().toString(),
          socialId: 'A987654321',
          marriage: 'married',
          address: '中山二路',
          phone: '0987654321',
          email: 'a987654321@gmail.com',
        });
        teacher.updateBasicInfo(newBasicInfo, function(status) {
          expect(status).toBe(true);
          teacher.getBasicInfo(function(info) {
            expect(Object.keys(info).length).not.toBe(0);
            for (var i = 0; i < Object.keys(info).length; ++i) {
              var key = Object.keys(info)[i];
              expect(info[key]).toBe(
                  newBasicInfo[key] === undefined ? null :
                                                    newBasicInfo[key]);
            }
            teachers.clear(function() {
              done();
            });
          });
        });
      });
    });
  });
});
