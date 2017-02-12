import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Alert, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { ParseProvider } from '../providers/parse-provider';

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
    public loadingCtrl: LoadingController,
    public parse: ParseProvider,
    ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home',icon: 'ios-water-outline',count: 0,component: HomePage}
    ];

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
    this.presentLoading();
    // this.nav.setRoot(UserPage);
    this.dismissLoading();
  }

  logout(){
    let me = this;
    me.presentLoading();
    me.parse.logout().then((response) => {
      return response;
    }).then((response) => {
      console.log(response)
      me.nav.setRoot(LoginPage);
    }).catch((ex) => {
      console.error(ex);
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