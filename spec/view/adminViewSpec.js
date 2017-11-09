var webdriver = require('selenium-webdriver');
// var chrome = require('selenium-webdriver/chrome');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

var driver = new webdriver.Builder().forBrowser('chrome').build();

describe('Admin Login Page', function() {

  it('Should be able to login with correct username and password', function(
                                                                       done) {
    driver.get('http://localhost:3000');
    var usernameElement = driver.findElement(By.css('label[for="username"]'));
    usernameElement.getText().then(function(text) {
      expect(text).toBe('使用者');

      var passwordElement =
          driver.findElement(By.css('label[for="password"]'));
      passwordElement.getText().then(function(text) {
        expect(text).toBe('密碼');
        var userField = driver.findElement(By.css('input[name="username"]'));
        userField.sendKeys('admin1');
        var passField = driver.findElement(By.css('input[name="password"]'));
        passField.sendKeys('admin1');
        var submit = driver.findElement(By.css('input[name="submit"]'));
        submit.sendKeys(Key.RETURN);

        driver.wait(function() {
          return driver.getTitle().then(function(title) {
            expect(title).toBe('管理');
            done();
          });
        }, 6000);
      });
    }, 10000);
  });

  afterEach(function(done) {
    setTimeout(function() {
      var logoutButton = driver.findElement(By.css('#logout'));
      logoutButton.click();

      setTimeout(function() {
        var yesButton = driver.findElement(By.id('yes'));
        yesButton.click();

        driver.wait(function() {
          return driver.getTitle().then(function(title) {
            expect(title).toBe('管理');
            done();
          });
        });
      }, 2000);
    }, 1000);
  }, 10000);
});
