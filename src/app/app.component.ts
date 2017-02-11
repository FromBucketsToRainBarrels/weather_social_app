import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import Parse from 'parse';


import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon: string, count: 0, component: any}>;

  loader: any;

  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController
    ) {
    this.initializeApp();
    this.initializeParse();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home',icon: 'ios-water-outline',count: 0,component: HomePage}
    ];

  }

  initializeParse(){
    // Initialize Parse with your app's Application ID and JavaScript Key
    Parse.initialize('FromBucketsToRainBarrels');
    Parse.serverURL = 'http://162.243.118.87:1337/parse';
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.presentLoading();
    this.nav.setRoot(page.component);
  }

  // view my profile
  viewMyProfile() {
    // this.nav.setRoot(UserPage);
  }

  logout(){
    this.presentLoading();
    var me = this;
    Parse.User.logOut().then(() => {
      me.nav.setRoot(LoginPage);    
    });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader = loader;
    loader.present();
  }

  dismissLoading(){
    this.loader.dismiss().catch(() => {});
  }

}