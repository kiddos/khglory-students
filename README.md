高雄榮光堂學生統計系統
======================


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
  - Sex
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


### Index Page

* Admin Login
  - Entry Page
  - Edit Page
  - Query Page
  - Admin Edit Page

* Entry Students
* Entry Teachers


### Entry Page

* Students
  1. Enter Name and Student Id
  2. Enter basic information
  3. Enter extra information
  4. Select Hard copy scan if it exists
  5. Confirm Entry
  6. Submit

* Teachers
  1. Enter Name
  2. Enter Basic Information
  3. Confirm Entry
  4. Submit

* Class
  1. Enter Class Name and start Date
  2. Select Teacher(s) from DB using name search
  3. Select Students from DB using name or id search

### Edit Page

* Students
  1. Select Student with name or id
  2. Choose Edit or Delete
    - Edit the students Information
    - Delete student entry

* Teachers
  1. Select teacher with name
  2. Choose Edit or Delete
    - Edit the teachers Information
    - Delete teacher entry

* Classes
  1. Choose Edit or Delete
    - Edit
      1. Select class with name, or Start Date
      2. Add/Remove Students
    - Delete
      1. Select class with name, or Start Date
      2. delete class


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
