import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {StatusBar} from 'ionic-native';
import { Events } from 'ionic-angular';
import { Pagination } from 'ionic2-pagination';


import Parse from 'parse';

// import pages
import {HomePage} from '../pages/home/home';
import {WeatherPage} from '../pages/weather/weather';
import {LoginPage} from '../pages/login/login';
import {UserPage} from '../pages/user/user';
import {LogoutPage} from '../pages/logout/logout';

import {UserService} from '../services/user-service';
import {WeatherService} from '../providers/weather-service/weather-service';

// import {CategoriesPage} from '../pages/categories/categories';
// import {FavoritePage} from '../pages/favorite/favorite';
// import {CartPage} from '../pages/cart/cart';
// import {OfferPage} from '../pages/offer/offer';
// import {SettingPage} from '../pages/setting/setting';
// import {NewsPage} from '../pages/news/news';
// import {AboutPage} from '../pages/about/about';
// import {ChatsPage} from '../pages/chats/chats';
// end import pages

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public user: any;

  public nav: any;

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },

    {
      title: 'Weather',
      icon: 'ios-cloud',
      count: 0,
      component: WeatherPage
    },

    {
      title: 'Logout',
      icon: 'ios-exit-outline',
      count: 0,
      component: LogoutPage
    }
    // import menu


  ];

  constructor(
    public platform: Platform,
    public events: Events,
    public userService : UserService
  ) {
    this.rootPage = LoginPage;

    // Initialize Parse with your app's Application ID and JavaScript Key 
    Parse.initialize('FromBucketsToRainBarrels');
    Parse.serverURL = 'http://162.243.118.87:1337/parse';

    events.subscribe('userFetch:complete', user => {
      this.user = user[0];
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // view my profile
  viewMyProfile() {
    this.nav.setRoot(UserPage);
  }
}


