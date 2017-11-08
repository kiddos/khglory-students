var classes = require('../models/classes');

describe('Class Model', function() {
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
        classes.clear();
        done();
      });
    });
  });
});
