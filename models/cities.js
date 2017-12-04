var db = require('./db_helper');
var colors = require('colors');

function migrate(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      transaction.run(`DROP TABLE IF EXISTS cities;`);

      transaction.run(`CREATE TABLE cities(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL);`);

      var cities = ['高雄', '台南', '屏東'];
      for (var i = 0; i < cities.length; ++i) {
        transaction.run(`INSERT INTO cities(name) VALUES(?);`, [cities[i]]);
      }

      transaction.commit(function(err) {
        if (err) {
          console.error(colors.red(err.message));
          if (callback) callback(false);
        } else {
          console.log(colors.green('cities migration done.'));
          if (callback) callback(true);
        }
      });
    });
  });
}

function queryAll(callback) {
  db.serialize(function() {
    db.all(`SELECT * FROM cities;`, function(err, rows) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback([]);
      } else {
        if (callback) callback(rows);
      }
    });
  });
}

function City(name) {
  this.name = name;
  this.region = [];
}

City.prototype.find = function(callback) {
  var city = this;
  if (city.name) {
    db.serialize(function() {
      db.get(
          `SELECT * FROM cities WHERE name = ?;`, [city.name],
          function(err, row) {
            if (err) {
              console.error(colors.red(err.message));
              if (callback) callback({});
            } else {
              city.id = row.id;
              if (callback) callback(row);
            }
          });
    });
  } else {
    if (callback) callback({});
  }
};

City.prototype.getRegions = function(callback) {
  var id = this.id;
  db.serialize(function() {
    db.all(
        `SELECT r.name FROM regions r
          INNER JOIN cities c
          ON c.id = r.city
          WHERE c.id = ?;`,
        [id], function(err, rows) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback([]);
          } else {
            if (callback) callback(rows);
          }
        });
  });
};

module.exports = {
  migrate: migrate,
  City: City,
  queryAll: queryAll,
};
