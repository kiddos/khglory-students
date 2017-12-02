var faker = require('faker');

var classes = require('../../models/classes');
var students = require('../../models/students');
var teachers = require('../../models/teachers');

students.migrate();
teachers.migrate();
classes.migrate();

describe('Class Model', function() {
  beforeEach(function(done) {
    students.generateStudents(200, function(status) {
      expect(status).toBe(true);

      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBe(200);

        teachers.generateTeachers(30, function(status) {
          expect(status).toBe(true);

          teachers.queryAll(function(allTeachers) {
            expect(allTeachers.length).toBe(30);
            done();
          });
        });
      });
    });
  }, 10000);

  it('Should be able to insert', function(done) {
    var className = faker.company.companyName() + ' Class';
    var c = new classes.Class(className, new Date().getTime());

    c.insert(function(status) {
      expect(status).toBe(true);
      expect(c.id).not.toBe(undefined);

      classes.queryAll(function(data) {
        expect(data.length > 0).toBe(true);
        var found = false;
        for (var i = 0; i < data.length; ++i) {
          found =
              (data[i].id === c.id && data[i].name === c.name &&
               data[i].startDate === c.startDate);
        }
        expect(found).toBe(true);
        done();
      });
    });
  }, 10000);

  it('Should not be able to insert with name not given', function(done) {
    var c = new classes.Class(null, new Date().getTime());

    c.insert(function(status) {
      expect(status).toBe(false);
      done();
    });
  });

  it('Should be able to add students', function(done) {
    var className = faker.company.companyName() + ' Class';
    var c = new classes.Class(className, new Date().getTime());

    c.insert(function(status) {
      expect(status).toBe(true);

      students.queryAll(function(allStudents) {
        var classStudents = [];
        for (var i = 1; i < classStudents.length; ++i) {
          if (faker.random.boolean()) {
            classStudents.push(allStudents[i]);
          }
        }

        c.addStudents(classStudents, function(status) {
          expect(status).toBe(true);

          c.getStudents(function(studentData) {
            expect(studentData.length).toBe(classStudents.length);

            for (var i = 0; i < studentData.length; ++i) {
              var keys = Object.keys(studentData[i]);
              for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                expect(studentsData[i][key]).toBe(classStudents[i][key]);
              }
            }
            done();
          });
        });
      });
    });
  }, 10000);

  it('Should be able to add teacher', function(done) {
    var className = faker.company.companyName() + ' Class';
    var c = new classes.Class(className, new Date().getTime());

    c.insert(function(status) {
      expect(status).toBe(true);
      teachers.queryAll(function(allTeachers) {
        var classTeacher = [];
        classTeacher.push(allTeachers[0]);
        for (var i = 1; i < allTeachers.length; ++i) {
          if (faker.random.boolean()) {
            classTeacher.push(allTeachers[i]);
          }
        }

        c.addTeachers(classTeacher, function(status) {
          expect(status).toBe(true);

          c.getTeachers(function(classTeacherData) {
            expect(classTeacher.length).toBe(classTeacher.length);
            for (var i = 0; i < classTeacherData.length; ++i) {
              var keys = Object.keys(classTeacherData[i]);
              for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                expect(classTeacherData[i][key]).toBe(classTeacher[i][key]);
              }
            }
            done();
          });
        });
      });
    });
  });

  afterEach(function(done) {
    classes.clear(function(status) {
      expect(status).toBe(true);
      students.clear(function(status) {
        expect(status).toBe(true);

        teachers.clear(function(status) {
          expect(status).toBe(true);

          done();
        });
      });
    });
  });
});
