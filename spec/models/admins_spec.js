var admins = require('../../models/admins');

admins.migrate();

describe('Admin', function() {
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
         expect(admin.id).not.toBe(undefined);
         expect(status).toBe(true);
         done();
       });
     });

  it('Should not be able to login with incorrect username or password',
    function(done) {
       var admin = new admins.Admin('admin1', 'wrong');
       admin.login(function(status) {
         expect(admin.id).toBe(undefined);
         expect(status).toBe(false);
         done();
       });
    });

  it('Should be able to be edited', function(done) {
    var admin = new admins.Admin('admin1', 'admin1');
    admin.edit('newusername', 'newpassword', function(status) {
      expect(status).toBe(true);
      admin.edit('admin1', 'admin1', function(status) {
        expect(status).toBe(true);
        done();
      });
    });
  });
});
