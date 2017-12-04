var db = require('./db_helper');
var colors = require('colors');

function migrate(callback) {
  db.serialize(function() {
    db.beginTransaction(function(err, transaction) {
      if (err) {
        console.error(colors.red(err.message));
        if (callback) callback(false);
      } else {
        transaction.run('PRAGMA foreign_keys = ON;');
        transaction.run(`DROP TABLE IF EXISTS regions;`);

        transaction.run(`CREATE TABLE IF NOT EXISTS regions(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          city INTEGER NOT NULL REFERENCES cities(id));`);

        var regions = [
          '鳳山區',   '三民區', '左營區', '前鎮區', '楠梓區', '苓雅區',
          '小港區',   '鼓山區', '大寮區', '岡山區', '仁武區', '林園區',
          '路竹區',   '新興區', '鳥松區', '大樹區', '美濃區', '橋頭區',
          '旗山區',   '梓官區', '大社區', '茄萣區', '燕巢區', '湖內區',
          '阿蓮區',   '旗津區', '前金區', '鹽埕區', '彌陀區', '內門區',
          '永安區',   '六龜區', '杉林區', '田寮區', '甲仙區', '桃源區',
          '那瑪夏區', '茂林區',
        ];
        var i;
        for (i = 0; i < regions.length; ++i) {
          transaction.run(
              `INSERT INTO regions(name, city) VALUES(?, ?);`,
              [regions[i], 1]);
        }

        regions = [
          '永康區', '安南區', '東區',   '北區',   '南區',   '新營區', '中西區',
          '仁德區', '歸仁區', '安平區', '佳里區', '善化區', '麻豆區', '新化區',
          '新市區', '關廟區', '安定區', '白河區', '學甲區', '鹽水區', '西港區',
          '下營區', '後壁區', '七股區', '六甲區', '官田區', '柳營區', '東山區',
          '將軍區', '玉井區', '北門區', '大內區', '楠西區', '南化區', '山上區',
          '左鎮區', '龍崎區',
        ];
        for (i = 0; i < regions.length; ++i) {
          transaction.run(
              `INSERT INTO regions(name, city) VALUES(?, ?);`,
              [regions[i], 2]);
        }

        regions = [
          '屏東市',       '內埔鄉',     '潮州鎮',     '萬丹鄉',
          '東港鎮',       '新園鄉',     '恆春鎮',     '長治鄉',
          '里港鄉',       '鹽埔鄉',     '高樹鄉',     '枋寮鄉',
          '九如鄉',       '萬巒鄉',     '佳冬鄉',     '林邊鄉',
          '竹田鄉',       '崁頂鄉',     '琉球鄉',     '麟洛鄉',
          '南州鄉',       '新埤鄉',     '車城鄉',     '滿州鄉',
          '(山)三地門鄉', '(山)來義鄉', '(山)瑪家鄉', '枋山鄉',
          '(山)泰武鄉',   '(山)牡丹鄉', '(山)春日鄉', '(山)獅子鄉',
          '(山)霧臺鄉',
        ];
        for (i = 0; i < regions.length; ++i) {
          transaction.run(
              `INSERT INTO regions(name, city) VALUES(?, ?);`,
              [regions[i], 3]);
        }

        transaction.commit(function(err) {
          if (err) {
            console.error(colors.red(err.message));
            if (callback) callback(false);
          } else {
            console.log(colors.green('regions migration done.'));
            if (callback) callback(true);
          }
        });
      }
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
  migrate: migrate,
  Region: Region,
  queryAll: queryAll,
};
