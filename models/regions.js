var db = require('./db_helper');
var colors = require('colors');

function migration(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      transaction.run(
          'CREATE TABLE IF NOT EXISTS regions(name TEXT PRIMARY KEY);');

      transaction.run('DELETE FROM regions;');

      var regions = [
        '鳳山區', '三民區',   '左營區', '前鎮區', '楠梓區', '苓雅區', '小港區',
        '鼓山區', '大寮區',   '岡山區', '仁武區', '林園區', '路竹區', '新興區',
        '鳥松區', '大樹區',   '美濃區', '橋頭區', '旗山區', '梓官區', '大社區',
        '茄萣區', '燕巢區',   '湖內區', '阿蓮區', '旗津區', '前金區', '鹽埕區',
        '彌陀區', '內門區',   '永安區', '六龜區', '杉林區', '田寮區', '甲仙區',
        '桃源區', '那瑪夏區', '茂林區',
      ];
      for (var i = 0; i < regions.length; ++i) {
        transaction.run('INSERT INTO regions VALUES(?)', [regions[i]]);
      }

      transaction.commit(function(err) {
        if (err) {
          console.error(colors.red(err.message));
          if (callback) callback([]);
        } else {
          console.log(colors.green('regions migration done.'));
          if (callback) callback(rows);
        }
      });
    });
  });
}

function Region(name) {
  this.name = name;
}

function queryAll(callback) {
  db.serialize(function() {
    db.all('SELECT * FROM regions;', function(err, rows) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback([]);
      } else {
        if (callback) callback(rows);
      }
    });
  });
}

module.exports = {
  migration: migration,
  Region: Region,
  queryAll: queryAll,
};
