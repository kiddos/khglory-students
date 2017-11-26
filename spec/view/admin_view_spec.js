
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

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
        done();
      });
    });
  });

  afterEach(function(done) {
    driver.wait(until.titleIs('Login'), 6000).then(function() {
      driver.close().then(done);
    });
  });
});
