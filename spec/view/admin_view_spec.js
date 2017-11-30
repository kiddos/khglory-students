var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

var admins = require('../../models/admins');

describe('Admin Login Page', function() {
  'use strict';

  var driver;

  beforeEach(function(done) {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.get('http://localhost:3000').then(function() {
      driver.wait(until.titleIs('Login')).then(function() { done(); });
    });
  });

  it('Should be able to login with correct account', function(done) {
    var usernameElement = driver.findElement(By.css('label[for="username"]'));
    usernameElement.getText().then(function(text) {
      expect(text).toBe('使用者');
    });

    var passwordElement = driver.findElement(By.css('label[for="password"]'));
    passwordElement.getText().then(function(text) {
      expect(text).toBe('密碼');
    });

    var userField = driver.findElement(By.css('input[name="username"]'));
    userField.sendKeys('admin1');
    var passField = driver.findElement(By.css('input[name="password"]'));
    passField.sendKeys('admin1');
    var submit = driver.findElement(By.css('input[name="submit"]'));
    submit.sendKeys(Key.RETURN).then(function() {
      driver.wait(until.titleIs('高雄榮光堂統計系統'), 3000).then(function() {
        var logoutButton = driver.findElement(By.id('logout'));
        logoutButton.click();

        var yesButton = driver.findElement(By.id('yes'));
        driver.wait(until.elementIsVisible(yesButton), 6000).then(function() {
          yesButton.click();
          done();
        });
      });
    });
  }, 10000);

  it('Should not be able to login with incorrect usename/password',
     function(done) {
       var userField = driver.findElement(By.css('input[name="username"]'));
       userField.sendKeys('random username');
       var passField = driver.findElement(By.css('input[name="password"]'));
       passField.sendKeys('random password');
       var submit = driver.findElement(By.css('input[name="submit"]'));

       submit.sendKeys(Key.RETURN).then(function() {
         driver.getTitle().then(function(title) {
           expect(title).toBe('Login');

           var messageText = driver.findElement(By.id('message-text'));
           driver.wait(until.elementIsVisible(messageText), 1000)
               .then(function() {
                 messageText.getText().then(function(text) {
                   expect(text).toBe('登入失敗');
                   done();
                 });
               });
         });
       });
     });

  afterEach(function(done) {
    driver.wait(until.titleIs('Login'), 6000).then(function() {
      driver.close().then(done);
    });
  });
});

describe('Admin Page', function() {
  beforeEach(function(done) {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.get('http://localhost:3000').then(function() {
      driver.wait(until.titleIs('Login')).then(function() {
        var userField = driver.findElement(By.css('input[name="username"]'));
        userField.sendKeys('admin1');
        var passField = driver.findElement(By.css('input[name="password"]'));
        passField.sendKeys('admin1');
        var submit = driver.findElement(By.css('input[name="submit"]'));

        submit.sendKeys(Key.RETURN).then(function() {
          driver.wait(until.titleIs('高雄榮光堂統計系統'), 3000).then(done);
        });
      });
    });
  });

  it('Should be able to change username and password', function(done) {
    var adminLink = driver.findElement(By.linkText('admin1'));
    adminLink.click();
    driver.wait(until.titleIs('admin'), 2000).then(function() {
      var newUsername = 'username';
      var usernameField = driver.findElement(By.id('username'));
      usernameField.sendKeys(newUsername);

      var newPassword = 'password';
      var passwordField = driver.findElement(By.id('password'));
      passwordField.sendKeys(newPassword);

      var repasswordField = driver.findElement(By.id('re-password'));
      repasswordField.sendKeys(newPassword);

      var submitButton = driver.findElement(By.id('submit'));
      submitButton.click();

      var messageText = driver.findElement(By.id('message-text'));
      driver.wait(until.elementIsVisible(messageText, 1000)).then(function() {
        messageText.getText().then(function(text) {
          expect(text).toBe('更改成功');

          var admin = new admins.Admin(newUsername, newPassword);
          admin.edit('admin1', 'admin1', function(status) {
            expect(status).toBe(true);

            done();
          });
        });
      });
    });
  });

  it('Should not be able to change username and password if incorrectly enter password',
     function(done) {
       var adminLink = driver.findElement(By.linkText('admin1'));
       adminLink.click();
       driver.wait(until.titleIs('admin'), 2000).then(function() {
         var newUsername = 'username';
         var usernameField = driver.findElement(By.id('username'));
         usernameField.sendKeys(newUsername);

         var newPassword = 'password';
         var passwordField = driver.findElement(By.id('password'));
         passwordField.sendKeys(newPassword);

         var repasswordField = driver.findElement(By.id('re-password'));
         repasswordField.sendKeys('wrong password');

         var submitButton = driver.findElement(By.id('submit'));
         submitButton.click();

         var messageText = driver.findElement(By.id('message-text'));
         driver.wait(until.elementIsVisible(messageText, 1000))
             .then(function() {
               messageText.getText().then(function(text) {
                 expect(text).toBe('更改失敗, 密碼輸入錯誤');

                 done();
               });
             });
       });
     });

  afterEach(function(done) {
    var logoutButton = driver.findElement(By.id('logout'));
    logoutButton.click();

    var yesButton = driver.findElement(By.id('yes'));
    driver.wait(until.elementIsVisible(yesButton), 6000).then(function() {
      yesButton.click();
      driver.wait(until.titleIs('Login'), 6000).then(function() {
        driver.close().then(done);
      });
    });
  });
});
