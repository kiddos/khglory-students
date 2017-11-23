var classes = require('../../models/classes');
var students = require('../../models/students');
var teachers = require('../../models/teachers');

describe('Class Model', function() {
  beforeEach(function(done) {
    var maxCount = 10;
    var index = 0;
    var insert = function() {
      var student = new students.Student(String(index), 'Student' + index);
      if (index < maxCount) {
        index += 1;
        student.insert(insert);
      } else {
        students.queryAll(function(data) {
          expect(index).toBe(maxCount);
          expect(data.length).toBe(maxCount);

          var teacher = new teachers.Teacher('TeacherA');
          teacher.insert(function(status) {
            expect(status).toBe(true);
            done();
          });
        });
      }
    };
    insert();
  }, 10000);

  it('Should be able to insert', function(done) {
    var c =
        new classes.Class('Intro to Computer Science', new Date().toString());
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
        classes.clear(function() {
          done();
        });
      });
    });
  });

  it('Should be able to add students', function(done) {
    var c =
        new classes.Class('Intro to Computer Science', new Date().toString());
    c.insert(function(status) {
      expect(status).toBe(true);
      students.queryAll(function(allStudents) {
        expect(allStudents.length).toBeGreaterThan(0);
        c.addStudents(allStudents, function(status) {
          expect(status).toBe(true);
          c.getStudents(function(studentsData) {
            expect(studentsData.length).toBe(10);
            classes.clear(function() {
              done();
            });
          });
        });
      });
    });
  });

  it('Should be able to add teacher', function(done) {
    var c =
        new classes.Class('Intro to Computer Science', new Date().toString());
    c.insert(function(status) {
      expect(status).toBe(true);
      teachers.queryAll(function(allTeachers) {
        expect(allTeachers.length).toBe(1);
        c.addTeachers(allTeachers, function(status) {
          expect(status).toBe(true);
          classes.clear(function() {
            done();
          });
        });
      });
    });
  });

  afterEach(function(done) {
    students.clear(function() {
      teachers.clear(function() { done(); });
    });
  });
});
