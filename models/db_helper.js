var sqlite3 = require('sqlite3').verbose();
var settings = require('../settings.js');
var colors = require('colors');
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;


var db =
    new TransactionDatabase(new sqlite3.Database(settings.db, function(err) {
      if (err) {
        return console.error(colors.red(err.messgage));
      }
      console.log('Connected to sqlite3 database');
    }));

module.exports = db;
