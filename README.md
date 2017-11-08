高雄榮光堂學生統計系統
======================

[![Build Status](https://travis-ci.org/kiddos/khglory-students.svg?branch=master)](https://travis-ci.org/kiddos/khglory-students)

![Cover](https://raw.githubusercontent.com/kiddos/khglory-students/master/public/images/background.jpg)

## Setup

* install [nodejs](https://nodejs.org/en/)
* clone the project

```shell
git clone https://github.com/kiddos/khglory-students
```

* install dependencies

```shell
npm install
```

* run schema migration

```shell
npm run migration
```

* Start the server

```shell
npm start
```


## Implementation Details

### Models

* Admin
  - Username
  - passwordMD5
(default 3 users)

* Students
  - Student ID
  - Name

* Basic Student information
  - Student
  - Sex
  - Birthday
  - Social ID
  - Marriage
  - Address
  - Phone number
  - email
  - Season

* Extra Student information
  - Student
  - Career
  - Education
  - Religion
  - Personal illness
  - Emergency contact

* Students Hard copy
  - student
  - Scanned Paper copy

* Teachers
  - Name

* Basic Teacher information
  - Teacher
  - gender
  - Birthday
  - Social ID
  - Marriage
  - Address
  - Phone number
  - email

* Classes
  - Name
  - Start Date

* Class Students
  - class
  - student

* Class Teachers
  - class
  - teacher


### Login Page

* Admin Login

* Entry Students (optional)
* Entry Teachers (optional)

### Index Page

* link to Students Page
* link to Teachers Page
* link to Classes Page
* link to Query Page

### Students Page

* Entry
  1. Enter Name and Student Id
  2. Enter basic information
  3. Enter extra information
  4. Select Hard copy scan if it exists
  5. Confirm Entry
  6. Submit

* Edit
  1. Select Student with name or id
  2. Choose Edit or Delete
    - Edit the students Information
    - Delete student entry

* list all students

### Teachers Page

* Entry
  1. Enter Name
  2. Enter Basic Information
  3. Confirm Entry
  4. Submit

* Edit
  1. Select teacher with name
  2. Choose Edit or Delete
    - Edit the teachers Information
    - Delete teacher entry

* list all teachers

### Classes Page

* Entry
  1. Enter Class Name and start Date
  2. Select Teacher(s) from DB using name search
  3. Select Students from DB using name or id search

* Edit
  1. Choose Edit or Delete
    - Edit
      1. Select class with name, or Start Date
      2. Add/Remove Students
    - Delete
      1. Select class with name, or Start Date
      2. delete class

* list all classes

### Query Page

* Join Students, Basic Student Information, Extra Student Information
* Select Students with religion
* Select Classes with students
* Select Classes with teachers
* Join Teachers, Basic Teacher Information
* Join Classes, Class Students
* Join Classes, Class Teachers

(Able to be viewed and output as csv)


### Admin Edit Page

* Enter New Admin user name
* Enter New Admin Password
* Reetner New Admin Password
* Submit
