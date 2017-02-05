import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';


import Parse from 'parse';

import {HomePage} from '../pages/home/home';
import {WeatherPage} from '../pages/weather/weather';
import {LoginPage} from '../pages/login/login';
import {LogoutPage} from '../pages/logout/logout';
import {UserPage} from '../pages/user/user';

//import services
import {UserService} from '../services/user-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  public user: any;

  pages: Array<{
    title: string,
    icon: string,
    count: 0,
    component: any
  }>;

  constructor(
    public platform: Platform,
    public events: Events,
    public userService : UserService
  ) {

    events.subscribe('userFetch:complete', user => {
      this.user = user;
    });

    this.initializeParse();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
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

  }

  initializeParse(){
    // Initialize Parse with your app's Application ID and JavaScript Key
    Parse.initialize('FromBucketsToRainBarrels');
    Parse.serverURL = 'http://162.243.118.87:1337/parse';
  }

  initializeApp() {
    let me = this;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      me.userService.getUserInfo().then(() => {
        Splashscreen.hide();
      });
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
