var admins = require('../models/admins.js');

describe('Admin module', function() {
  it('Should have 3 default admins', function(done) {
    var data = admins.queryAll(function(rows) {
      expect(rows.length).toBe(3);
      done();
    });
  });

  it('Should be able to login with correct username and password',
     function(done) {
       var admin = new admins.Admin('admin1', 'admin1');
       admin.login(function(status) {
         expect(status).toBe(true);
         done();
       });
     });
});
