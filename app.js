var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');

var settings = require('./settings');
var index = require('./routes/index');
var update = require('./routes/update');
var admin = require('./routes/admin');
var students = require('./routes/students');
var teachers = require('./routes/teachers');
var classes = require('./routes/classes');
var query = require('./routes/query');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: settings.secret,
  resave: true,
  saveUninitialized: true,
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,  // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use(
    express.static(path.join(__dirname, 'node_modules', 'd3', 'build')));

app.use('/', index);
app.use('/', admin);
app.use('/update', update);
app.use('/students', students);
app.use('/teachers', teachers);
app.use('/classes', classes);
app.use('/query', query);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
