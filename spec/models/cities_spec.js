var cities = require('../../models/cities');
var regions = require('../../models/regions');

describe('Cities', function() {
  beforeAll(function(done) {
    cities.migrate(function() {
      regions.migrate(done);
    });
  });

  it('Should have 3 cities by default', function(done) {
    cities.queryAll(function(citiesData) {
      expect(citiesData.length).toBe(3);
      expect(citiesData[0].name).toBe('高雄');
      expect(citiesData[0].id).toBe(1);

      expect(citiesData[1].name).toBe('台南');
      expect(citiesData[1].id).toBe(2);

      expect(citiesData[2].name).toBe('屏東');
      expect(citiesData[2].id).toBe(3);

      done();
    });
  });

  it('高雄 Should be found', function(done) {
    var city = new cities.City('高雄');
    city.find(function(cityData) {
      expect(cityData).not.toBe(undefined);
      expect(cityData.name).toBe(city.name);
      expect(cityData.id).toBe(1);
      done();
    });
  });

  it('高雄 Should have 38 regions', function(done) {
    var city = new cities.City('高雄');
    city.find(function(cityData) {
      city.getRegions(function(regions) {
        expect(regions.length).toBe(38);
        done();
      });
    });
  });

  it('台南 Should be found', function(done) {
    var city = new cities.City('台南');
    city.find(function(cityData) {
      expect(cityData).not.toBe(undefined);
      expect(cityData.name).toBe(city.name);
      expect(cityData.id).toBe(2);
      done();
    });
  });

  it('台南 Should have 37 regions', function(done) {
    var city = new cities.City('台南');
    city.find(function(cityData) {
      city.getRegions(function(regions) {
        expect(regions.length).toBe(37);
        done();
      });
    });
  });

  it('屏東 Should be found', function(done) {
    var city = new cities.City('屏東');
    city.find(function(cityData) {
      expect(cityData).not.toBe(undefined);
      expect(cityData.name).toBe(city.name);
      expect(cityData.id).toBe(3);
      done();
    });
  });

  it('屏東 Should have 33 regions', function(done) {
    var city = new cities.City('屏東');
    city.find(function(cityData) {
      city.getRegions(function(regions) {
        expect(regions.length).toBe(33);
        done();
      });
    });
  });
});
