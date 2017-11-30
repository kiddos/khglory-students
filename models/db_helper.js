var sqlite3 = require('sqlite3').verbose();
var settings = require('../settings.js');
var colors = require('colors');
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;

function enableForiegnKey(db) {
  db.run('PRAGMA foreign_keys = ON;', function(err) {
    if (err) {
      console.error(colors.red(err.messgage));
    } else {
      console.log(colors.green('enable foriegn keys'));
    }
  });
}

var db;
if (process.env.DEBUG === 'TRUE') {
  db = new TransactionDatabase(new sqlite3.Database(':memory:', function(err) {
    if (err) {
      console.error(colors.red(err.messgage));
    } else {
      console.log('Connected to sqlite3 memory');
      enableForiegnKey(db);
    }
  }));
} else {
  db =
      new TransactionDatabase(new sqlite3.Database(settings.db, function(err) {
        if (err) {
          console.error(colors.red(err.messgage));
        } else {
          console.log('Connected to sqlite3 database');
          enableForiegnKey(db);
        }
      }));
}

module.exports = db;
