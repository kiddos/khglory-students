var faker = require('faker');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

var students = require('../../models/students');

describe('Student Web Function', function() {
  'use strict';

  var driver;

  beforeEach(function(done) {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.get('http://localhost:3000').then(function() {
      driver.wait(until.titleIs('Login'), 6000).then(function() {
        var userField = driver.findElement(By.css('input[name="username"]'));
        userField.sendKeys('admin1');
        var passField = driver.findElement(By.css('input[name="password"]'));
        passField.sendKeys('admin1');
        var submit = driver.findElement(By.css('input[name="submit"]'));
        submit.sendKeys(Key.RETURN).then(function() {
          driver.wait(until.titleIs('高雄榮光堂統計系統')).then(function() {
            done();
          });
        });
      });
    });
  }, 10000);

  it('Should be able to add new students', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(String(faker.random.uuid()), name);

    var birthday = new Date(faker.date.between('1900-01-01', '2016-12-31'));
    var basicInfo = new students.BasicInfo({
      studentId: student.id,
      gender: '男',
      birthday: new Date(
                    (birthday.getFullYear()) + '-' + (birthday.getMonth()) +
                    '-' + (birthday.getDate()))
                    .getTime(),
      socialId: 'Z' + faker.random.number({min: 100000000, max: 999999999}),
      marriage: '單身',
      address: faker.address.streetAddress('###'),
      phone: faker.phone.phoneNumberFormat(1),
      email: faker.internet.email(),
    });

    var extraInfo = new students.ExtraInfo({
      studentId: student.id,
      career: faker.name.jobTitle(),
      education: '高中以下',
      religion: '基督教',
      illness: faker.random.boolean() ? 'None' : 'common cold',
      emergencyContact: faker.random.boolean() ? 'mom' : 'dad',
      emergencyContactPhone: faker.phone.phoneNumberFormat(1),
    });

    var studentNav = driver.findElement(By.css('.menu-item:first-of-type'));
    studentNav.click();

    var addStudentTab = driver.findElement(By.linkText('加入學生資料'));
    driver.wait(until.elementIsVisible(addStudentTab), 1000).then(function() {
      addStudentTab.click();
      driver.wait(until.titleIs('加入學生資料'), 6000).then(function() {
        // fill in the form
        var idField = driver.findElement(By.css('input[name="id"]'));
        idField.sendKeys(student.id);

        var nameField = driver.findElement(By.css('input[name="name"]'));
        nameField.sendKeys(student.name);

        var genderButton = driver.findElement(By.css('input[name="gender"]'));
        genderButton.click();

        var bd = new Date(basicInfo.birthday);
        var yearField = driver.findElement(By.css('input[name="year"]'));
        yearField.sendKeys(String(bd.getFullYear()));

        var monthField = driver.findElement(By.css('input[name="month"]'));
        monthField.sendKeys(String(bd.getMonth() + 1));

        var dayField = driver.findElement(By.css('input[name="day"]'));
        dayField.sendKeys(String(bd.getDate()));

        var socialIdField =
            driver.findElement(By.css('input[name="socialId"]'));
        socialIdField.sendKeys(basicInfo.socialId);

        var marriageButton =
            driver.findElement(By.css('input[name="marriage"]'));
        marriageButton.click();

        var addressField = driver.findElement(By.css('input[name="address"]'));
        addressField.sendKeys(basicInfo.address);

        var phoneField = driver.findElement(By.css('input[name="phone"]'));
        phoneField.sendKeys(basicInfo.phone);

        var emailField = driver.findElement(By.css('input[name="email"]'));
        emailField.sendKeys(basicInfo.email);

        var nextButton = driver.findElement(By.id('next'));
        nextButton.click().then(function() {
          var careerField = driver.findElement(By.css('input[name="career"]'));
          careerField.sendKeys(extraInfo.career);

          var educationButton =
              driver.findElement(By.css('input[name="education"]'));
          educationButton.click();

          var religionButton =
              driver.findElement(By.css('input[name="religion"]'));
          religionButton.click();

          var illness = driver.findElement(By.css('input[name="illness"]'));
          illness.sendKeys(extraInfo.illness);

          var emergencyContactField =
              driver.findElement(By.css('input[name="emergencyContact"]'));
          emergencyContactField.sendKeys(extraInfo.emergencyContact);

          var emergencyContactPhoneField = driver.findElement(
              By.css('input[name="emergencyContactPhone"]'));
          emergencyContactPhoneField.sendKeys(extraInfo.emergencyContactPhone);

          nextButton.click().then(function() {
            var messageDialog = driver.findElement(By.id('message-text'));
            driver.wait(until.elementIsVisible(messageDialog), 3000)
                .then(function() {
                  student.find(function(studentData) {
                    expect(studentData).not.toBe(null);
                    expect(studentData.id).toBe(student.id);
                    expect(studentData.name).toBe(student.name);

                    student.getBasicInfo(function(basicInfoData) {
                      var keys = Object.keys(basicInfoData);
                      for (var i = 0; i < keys.length; ++i) {
                        var key = keys[i];
                        expect(basicInfo[key]).toBe(basicInfoData[key]);
                      }

                      student.getExtraInfo(function(extraInfoData) {
                        keys = Object.keys(basicInfoData);
                        for (var i = 0; i < keys.length; ++i) {
                          var key = keys[i];
                          expect(extraInfo[key]).toBe(extraInfoData[key]);
                        }

                        student.remove(function(status) { done(); });
                      });
                    });
                  });
                });
          });
        });
      });
    });
  });

  it('Should be able to go back and change form', function(done) {
    var studentNav = driver.findElement(By.css('.menu-item:first-of-type'));
    studentNav.click();

    var addStudentTab = driver.findElement(By.linkText('加入學生資料'));
    driver.wait(until.elementIsVisible(addStudentTab), 1000).then(function() {
      addStudentTab.click();
      driver.wait(until.titleIs('加入學生資料'), 6000).then(function() {
        var name =
            '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
        var student = new students.Student(String(faker.random.uuid()), name);

        var idField = driver.findElement(By.css('input[name="id"]'));
        idField.sendKeys(student.id);

        var nameField = driver.findElement(By.css('input[name="name"]'));
        nameField.sendKeys(student.name);

        var nextButton = driver.findElement(By.id('next'));
        nextButton.click().then(function() {
          var prevButton = driver.findElement(By.id('previous'));
          driver.wait(until.elementIsEnabled(prevButton), 3000)
              .then(function() {
                prevButton.click();
                done();
              });
        });
      });
    });
  });

  it('Should be able to edit students', function(done) {
    var studentNav = driver.findElement(By.css('.menu-item:first-of-type'));
    studentNav.click();

    var editStudentTab = driver.findElement(By.linkText('編輯學生資料'));
    driver.wait(until.elementIsVisible(editStudentTab), 1000).then(function() {
      editStudentTab.click();
      var editButton = driver.findElement(By.css('.edit:first-of-type'));
      editButton.click().then(function() {
        var nameField =
            driver.findElement(By.css('.edit-field:first-of-type'));
        driver.wait(until.elementIsEnabled(nameField), 1000).then(function() {
          nameField.sendKeys(' edited');

          var confirmButton =
              driver.findElement(By.className('confirm'));
          confirmButton.click();

          nameField.getAttribute('value').then(function(name) {
            driver.navigate().refresh();

            var refreshedNameField =
                driver.findElement(By.css('.edit-field:first-of-type'));

            refreshedNameField.getAttribute('value').then(
                function(refreshedName) {
                  expect(name).toBe(refreshedName);
                  done();
                });
          });
        });
      });
    });
  });

  afterEach(function(done) {
    // logout
    var logoutButton = driver.findElement(By.id('logout'));
    logoutButton.click().then(function() {
      var yesButton = driver.findElement(By.id('yes'));
      driver.wait(until.elementIsVisible(yesButton), 6000).then(function() {
        yesButton.click();
        driver.wait(until.titleIs('Login'), 6000).then(function() {
          driver.close().then(done);
        });
      });
    });
  }, 10000);
});
