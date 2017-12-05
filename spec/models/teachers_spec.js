var faker = require('faker');

var teachers = require('../../models/teachers');

teachers.migrate();

describe('Teacher', function() {
  it('Should be able to create', function(done) {
    var name = '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
    var teacher = new teachers.Teacher(name);
    teacher.insert(function(status) {
      expect(status).toBe(true);
      expect(teacher.id).not.toBe(undefined);
      done();
    });
  });

  it('Should be able to create multiple', function(done) {
    var maxCount = 100;
    var index = 0;
    var teacherContainer = [];
    var insert = function() {
      var name =
          '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
      var teacher = new teachers.Teacher(name);
      teacherContainer.push(teacher);

      if (index < maxCount) {
        index += 1;
        teacher.insert(insert);
      } else {
        teachers.queryAll(function(allTeachers) {
          expect(allTeachers.length).toBe(maxCount);

          var found = 0;
          for (var i = 0; i < maxCount; ++i) {
            for (var j = 0; j < teacherContainer.length; ++j) {
              if (allTeachers[i].name === teacherContainer[j].name) {
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

  it('Should be able to be found with correct id', function(done) {
    var name = '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
    var teacher = new teachers.Teacher(name);
    teacher.insert(function(status) {
      expect(status).toBe(true);

      teacher.find(function(teacherData) {
        expect(teacherData.id).toBe(teacher.id);
        expect(teacherData.name).toBe(teacher.name);
        done();
      });
    });
  });

  it('Should not be able to be found with incorrect id', function(done) {
    var name = '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
    var teacher = new teachers.Teacher(name);

    teacher.insert(function(status) {
      expect(status).toBe(true);

      teacher.id = -1;

      teacher.find(function(teacherData) {
        expect(teacherData).toBe(undefined);
        done();
      });
    });
  });

  it('Should be able to be removed', function(done) {
    var name = '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
    var teacher = new teachers.Teacher(name);
    teacher.insert(function(status) {
      expect(status).toBe(true);

      teacher.remove(function(status) {
        expect(status).toBe(true);
        teachers.queryAll(function(allTeachers) {
          expect(allTeachers.length).toBe(0);
          done();
        });
      });
    });
  });

  it('Should be able to change name', function(done) {
    var name = '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
    var teacher = new teachers.Teacher(name);
    teacher.insert(function(status) {
      expect(status).toBe(true);

      var newName =
          '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
      teacher.changeName(newName, function(status) {
        expect(status).toBe(true);
        expect(teacher.name).toBe(newName);
        teacher.find(function(teacherData) {
          expect(teacherData.name).toBe(newName);
          done();
        });
      });
    });
  });

  it('Should be able to generate lots of teachers', function(done) {
    var num = 100;
    teachers.generateTeachers(num, function(status) {
      expect(status).toBe(true);
      teachers.queryAll(function(allTeachers) {
        expect(allTeachers.length).toBe(num);
        done();
      });
    });
  }, 10000);

  afterEach(function(done) {
    teachers.clear(function() {
      teachers.queryAll(function(allTeachers) {
        expect(allTeachers.length).toBe(0);
        done();
      });
    });
  });
});

describe('Teacher BasicInfo Model', function() {
  beforeEach(function(done) {
    var name = '中文: ' + faker.name.firstName() + ' ' + faker.name.lastName();
    var teacher = new teachers.Teacher(name);
    teacher.insert(function(status) {
      expect(status).toBe(true);
      expect(teacher.id).not.toBe(null);
      expect(teacher.id).not.toBe(undefined);

      teachers.queryAll(function(teacherData) {
        expect(teacherData.length).toBe(1);
        done();
      });
    });
  });

  it('Should be able to add BasicInfo', function(done) {
    teachers.queryAll(function(allTeachers) {
      var teacher = new teachers.Teacher(allTeachers[0].name);
      teacher.id = allTeachers[0].id;

      var basicInfo = new teachers.BasicInfo({
        teacherId: teacher.id,
        gender: faker.random.boolean() ? '男' : '女',
        birthday: faker.date.between('1900-01-01', '2016-12-31').getTime(),
        socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });

      teacher.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        teacher.getBasicInfo(function(basicInfoData) {
          expect(basicInfoData).not.toBe(null);
          expect(basicInfoData).not.toBe(undefined);

          var keys = Object.keys(basicInfoData);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            expect(basicInfo[key] ? basicInfo[key] : null)
                .toBe(basicInfoData[key]);
          }
          done();
        });
      });
    });
  }, 20000);

  it('Should be able to add BasicInfo with partial data', function(done) {
    teachers.queryAll(function(allTeachers) {
      var teacher = new teachers.Teacher(allTeachers[0].name);
      teacher.id = allTeachers[0].id;

      var basicInfo = new teachers.BasicInfo({
        teacherId: teacher.id,
        gender: faker.random.boolean() ? '男' : '女',
        birthday: faker.date.between('1900-01-01', '2016-12-31').getTime(),
        socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });

      var keys = Object.keys(basicInfo);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key === 'teacherId') continue;
        if (faker.random.boolean()) {
          basicInfo[key] = undefined;
        }
      }

      teacher.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);
        teacher.getBasicInfo(function(basicInfoData) {
          expect(basicInfoData).not.toBe(null);
          expect(basicInfoData).not.toBe(undefined);

          var keys = Object.keys(basicInfoData);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            expect(basicInfo[key] ? basicInfo[key] : null)
                .toBe(basicInfoData[key]);
          }
          done();
        });
      });
    });
  }, 10000);

  it('Should not be able to add BasicInfo with incorrect id', function(done) {
    teachers.queryAll(function(allTeachers) {
      var teacher = new teachers.Teacher(allTeachers[0].name);
      teacher.id = allTeachers[0].id;

      var basicInfo = new teachers.BasicInfo({
        teacherId: faker.random.uuid(),
        gender: faker.random.boolean() ? '男' : '女',
        birthday: faker.date.between('1900-01-01', '2016-12-31').getTime(),
        socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
        address: faker.address.streetAddress('###'),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });
      teacher.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(false);
        done();
      });
    });
  }, 6000);

  it('Should be able to update its BasicInfo', function(done) {
    teachers.queryAll(function(allTeachers) {
      var teacher = new teachers.Teacher(allTeachers[0].name);
      teacher.id = allTeachers[0].id;

      var basicInfo = new teachers.BasicInfo({
        teacherId: teacher.id,
        gender: faker.random.boolean() ? '男' : '女',
        birthday: faker.date.between('1900-01-01', '2016-12-31').getTime(),
        socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
        phone: faker.phone.phoneNumberFormat(1),
        email: faker.internet.email(),
      });

      teacher.addBasicInfo(basicInfo, function(status) {
        expect(status).toBe(true);

        var newBasicInfo = new teachers.BasicInfo({
          teacherId: teacher.id,
          gender: faker.random.boolean() ? '男' : '女',
          birthday: faker.date.between('1900-01-01', '2016-12-31').getTime(),
          socialId:
              'Z' + faker.random.number({min: 100000000, max: 999999999}),
          phone: faker.phone.phoneNumberFormat(1),
          email: faker.internet.email(),
        });

        teacher.updateBasicInfo(newBasicInfo, function(status) {
          expect(status).toBe(true);

          teacher.getBasicInfo(function(basicInfoData) {
            expect(basicInfoData).not.toBe(null);
            expect(basicInfoData).not.toBe(undefined);

            var keys = Object.keys(basicInfoData);
            for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              expect(newBasicInfo[key] ? newBasicInfo[key] : null)
                  .toBe(basicInfoData[key]);
            }
            done();
          });
        });
      });
    });
  }, 10000);

  it('Should not be able to update its basicInfo with incorrect id',
     function(done) {
       teachers.queryAll(function(allTeachers) {
         var teacher = new teachers.Teacher(allTeachers[0].name);
         teacher.id = allTeachers[0].id;

         var basicInfo = new teachers.BasicInfo({
           teacherId: teacher.id,
           gender: faker.random.boolean() ? '男' : '女',
           birthday: faker.date.between('1900-01-01', '2016-12-31').getTime(),
           socialId:
               'Z' + faker.random.number({min: 100000000, max: 999999999}),
           phone: faker.phone.phoneNumberFormat(1),
           email: faker.internet.email(),
         });

         teacher.addBasicInfo(basicInfo, function(status) {
           expect(status).toBe(true);

           var newBasicInfo = new teachers.BasicInfo({
             teacherId: -1,
             gender: faker.random.boolean() ? '男' : '女',
             birthday:
                 faker.date.between('1900-01-01', '2016-12-31').getTime(),
             socialId:
                 'Z' + faker.random.number({min: 100000000, max: 999999999}),
             phone: faker.phone.phoneNumberFormat(1),
             email: faker.internet.email(),
           });

           teacher.updateBasicInfo(newBasicInfo, function(status) {
             expect(status).toBe(false);
             done();
           });
         });
       });
     });

  afterEach(function(done) {
    teachers.clear(function() {
      teachers.queryAll(function(allTeacher) {
        expect(allTeacher.length).toBe(0);
        done();
      });
    });
  });
});
