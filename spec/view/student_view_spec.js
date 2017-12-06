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
    students.generateStudents(100, function(status) {
      expect(status).toBe(true);

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
    });
  }, 10000);

  it('Should be able to add new students', function(done) {
    var name = '中文' + faker.name.firstName() + ' ' + faker.name.lastName();
    var student = new students.Student(name);

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

        var cityButton = driver.findElement(By.css('input[name="city"]'));
        cityButton.click();

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
                  students.queryAll(function(studentData) {
                    var found = false;
                    for (var i = 0; i < studentData.length; ++i) {
                      found = (studentData[i].name === student.name);
                      if (found) {
                        student.id = studentData[i].id;
                      }
                    }
                    expect(found).toBe(true);
                    student.remove(function(status) {
                      expect(status).toBe(true);
                      done();
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
        var student = new students.Student(name);

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
      driver.wait(until.titleIs('學生資料編輯'), 1000).then(function() {
        setTimeout(function() {
          var nameField =
              driver.findElement(By.css('.edit-field:first-of-type'));
          nameField.sendKeys(' edited');
          var confirmButton = driver.findElement(By.className('confirm'));
          confirmButton.click();

          nameField.getAttribute('value').then(function(name) {
            driver.navigate().refresh();

            setTimeout(function() {
              var refreshedNameField =
                  driver.findElement(By.css('.edit-field:first-of-type'));

              refreshedNameField.getAttribute('value').then(
                  function(refreshedName) {
                    expect(name).toBe(refreshedName);
                    done();
                  });
            }, 2000);
          });
        }, 2000);
      });
    });
  });

  it('Should be able to delete student', function(done) {
    var studentNav = driver.findElement(By.css('.menu-item:first-of-type'));
    studentNav.click();

    var editStudentTab = driver.findElement(By.linkText('編輯學生資料'));
    driver.wait(until.elementIsVisible(editStudentTab), 1000).then(function() {
      editStudentTab.click();
      driver.wait(until.titleIs('學生資料編輯'), 1000).then(function() {
        setTimeout(function() {
          var nameField = driver.findElement(By.className('edit-field'));

          var deleteButton = driver.findElement(By.className('delete'));
          deleteButton.click();

          var yesButton = driver.findElement(By.id('yes'));
          driver.wait(until.elementIsVisible(yesButton), 3000)
              .then(function() {
                yesButton.click();

                var messageDialog = driver.findElement(By.id('message-text'));
                driver.wait(until.elementIsVisible(messageDialog), 3000)
                    .then(function() {
                      messageDialog.getText().then(function(text) {
                        expect(text).toBe('刪除成功');
                        setTimeout(function() {
                          done();
                        }, 2000);
                      });
                    });
              }, 2000);
        });
      });
    });
  });

  afterEach(function(done) {
    students.clear(function(status) {
      expect(status).toBe(true);
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
    });
  }, 10000);
});
