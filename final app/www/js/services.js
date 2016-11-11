var user_arya = {
  username: "Arya Stark",
  pic: "arya.jpg",
  friends: [user_sansa,user_jon,user_tyrion,user_cersei,user_khalisi]
}

var user_tyrion = {
  username: "Tyrion Lannister",
  pic: "tyrion.jpg",
  friends: [user_sansa,user_jon,user_cersei,user_khalisi]
}

var user_sansa = {
  username: "Sansa Stark",
  pic: "sansa.jpg",
  friends: [user_jon,user_cersei,user_khalisi]
}

var user_jon = {
  username: "Jon Snow",
  pic: "jon.jpg",
  friends: [user_cersei,user_khalisi]
}

var user_cersei = {
  username: "Cersei Lannister",
  pic: "cersei.jpg",
  friends: [user_khalisi]
}

var user_khalisi = {
  username: "Daenerys Targaryen",
  pic: "khalisi.jpg",
  friends: []
}

angular.module('starter.services', [])

.factory('Users', function() {
  return {
    getCurrentUser: function() {
      return user_tyrion;
    }
  };
})

.factory('Posts', function() {
  // Some fake testing data  
  var comment1 = {
    user : user_sansa,
    data: {
      type: "text",
      value: "There are no heroes...in life, the monsters win."
    }
  }
  var comment2 = {
    user : user_jon,
    data: {
      type: "text",
      value: "The only time a man can be brave is when he is afraid."
    }
  }
  var comment3 = {
    user : user_cersei,
    data: {
      type: "text",
      value: "Tears aren't a woman's only weapon."
    }
  }

  var post1 = {
    id: 1,
    user: user_cersei,
    location: "Casterly Rock, Westerlands",
    data: {
      type: "text",
      value: "I am Cersei of House Lannister, a lion of the Rock, the rightful queen of these Seven Kingdoms, trueborn daughter of Tywin Lannister. And hair grows back."
    },
    likes: [user_sansa,user_jon,user_arya,user_cersei],
    comments: [comment1,comment2],
    time: new Date()
  }

  var post2 = {
    id: 2,
    user: user_arya,
    location: "Braavos, The Free Cities, Essos",
    data: {
      type: "text",
      value: "The quickest way to a man's heart is through Arya's needle. She has two speeds: Walk and Kill, and is the reason why Waldo is still hiding."
    },
    likes: [user_sansa,user_jon],
    comments: [comment1,comment2, comment3],
    time: new Date()
  }

  var post3 = {
    id: 3,
    user: user_khalisi,
    location: "Dragonstone, Island of Dragonstone, Crownlands",
    data: {
      type: "picture",
      value: "When my dragons are grown, we will take back what was stolen from me and destroy those who wronged me! We will lay waste to armies and burn cities to the ground!",
      pic: "khalisi-and-dragon.jpg"
    },
    likes: [user_sansa, user_jon, user_khalisi],
    comments: [comment2],
    time: new Date()
  }

  var posts = [post1,post3,post2];

  return {
    all: function() {
      return posts;
    },
    getPost: function(postId) {
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === parseInt(postId)) {
          return posts[i];
        }
      }
      return null;
    }
  };
})

.factory('Stations', function() {
  // Might use a resource here that returns a JSON array
  
  // Some fake testing data
  var stationWeatherDetailObject = {
    currentWeather: {
      temprature: 9,
      feelLise: 8,
      description: "Partly Cloudy",
      windLow: 19,
      windLowDir: "SW",
      windHigh: 28,
      humidity: 66,
      pressure: 99.6,
      visibility: 24,
      airQuality: "Low Risk",
      UVReport: "Low"
    },
    forcastWeather: {}
  };

  var stations = [{
    id: 4,
    city: 'Longido',
    country: 'Tanzania',
    lastSync: '7 minutes ago',
    image: 'img/tanzania.png',
    weatherTumbnail: 'ion-ios-cloudy-night',
    avatar: '',
    weatherData: stationWeatherDetailObject
  }, {
    id: 1,
    city: 'Ottawa',
    country: 'Canada',
    lastSync: '4 Days ago',
    image: 'img/canada.jpg',
    weatherTumbnail: 'ion-ios-thunderstorm',
    avatar: '',
    weatherData: stationWeatherDetailObject
  }, {
    id: 2,
    city: 'Lipatimmro',
    country: 'Kenya',
    lastSync: 'Dec 23 2015',
    image: 'img/kenya.png',
    weatherTumbnail: 'ion-ios-snowy',
    avatar: '',
    weatherData: stationWeatherDetailObject
  }, {
    id: 3,
    city: 'Lahore',
    country: 'Pakistan',
    lastSync: '36 seconds ago',
    image: 'img/pakistan.png',
    weatherTumbnail: 'ion-ios-partlysunny ',
    avatar: '',
    weatherData: stationWeatherDetailObject
  }, {
    id: 5,
    city: 'Stolkholm',
    country: 'Sweden',
    lastSync: '45 minutes ago',
    image: 'img/sweden.png',
    weatherTumbnail: 'ion-ios-sunny',
    avatar: '',
    weatherData: stationWeatherDetailObject
  }];

  return {
    all: function() {
      return stations;
    },
    remove: function(station) {
      stations.splice(stations.indexOf(station), 1);
    },
    getStation: function(stationId) {
      for (var i = 0; i < stations.length; i++) {
        if (stations[i].id === parseInt(stationId)) {
          return stations[i];
        }
      }
      return null;
    }
  };
});
