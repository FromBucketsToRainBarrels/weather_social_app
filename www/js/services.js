angular.module('starter.services', [])

.factory('Stations', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var stations = [{
    id: 4,
    city: 'Longido',
    country: 'Tanzania',
    lastSync: '7 minutes ago',
    image: 'img/ben.png',
    weatherTumbnail: 'ion-ios-cloudy-night',
    avatar: ''
  }, {
    id: 1,
    city: 'Ottawa',
    country: 'Tanzania',
    lastSync: '4 Days ago',
    image: 'img/ben.png',
    weatherTumbnail: 'ion-ios-thunderstorm',
    avatar: ''
  }, {
    id: 2,
    city: 'Lipatimmro',
    country: 'Kenya',
    lastSync: 'Dec 23 2015',
    image: 'img/ben.png',
    weatherTumbnail: 'ion-ios-snowy',
    avatar: ''
  }, {
    id: 3,
    city: 'Lahore',
    country: 'Pakistan',
    lastSync: '36 seconds ago',
    image: 'img/ben.png',
    weatherTumbnail: 'ion-ios-partlysunny ',
    avatar: ''
  }, {
    id: 4,
    city: 'Stolkholm',
    country: 'Sweden',
    lastSync: '45 minutes ago',
    image: 'img/ben.png',
    weatherTumbnail: 'ion-ios-sunny',
    avatar: ''
  }];

  return {
    all: function() {
      return stations;
    },
    remove: function(station) {
      stations.splice(stations.indexOf(station), 1);
    },
    get: function(stationId) {
      for (var i = 0; i < stations.length; i++) {
        if (stations[i].id === parseInt(stationId)) {
          return stations[i];
        }
      }
      return null;
    }
  };
});
