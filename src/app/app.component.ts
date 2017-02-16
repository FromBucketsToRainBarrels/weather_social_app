import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Alert, LoadingController, Events, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';
import {DomSanitizer} from '@angular/platform-browser';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/user/user';

import { ParseProvider } from '../providers/parse-provider';
import ImgCache from 'imgcache.js';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, icon: string, count: 0, component: any}>;
  loader: any;
  user: any;
  imageCacheInit: boolean = false;

  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public parse: ParseProvider,
    public events: Events,
    private toastCtrl: ToastController,
    ) {
    this.subscribeEvents();
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home',icon: 'ios-water-outline',count: 0,component: HomePage}
    ];
  }

  initializeApp() {
    let me = this;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      
      // activated debug mode
      ImgCache.options.debug = true;
      ImgCache.options.usePersistentCache = true;
      
      
      // page is set until img cache has started
      ImgCache.init(()=>{ 
        console.log("clearCache");
        ImgCache.clearCache(function () {
          // continue cleanup...
          console.log("continue cleanup...");
        }, function () {
          // something went wrong
          console.log("something went wrong");
        });
        me.events.publish("ImgCache.init.success",true);
        me.imageCacheInit = true;
        this.nav.setRoot(LoginPage);
        Splashscreen.hide(); 
      },()=>{ 
        console.error('ImgCache init: error! Check the log for errors');
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.presentLoading();
    this.nav.setRoot(page.component);
    this.dismissLoading();
  }

  // view my profile
  viewMyProfile() {
    this.presentLoading();
    this.nav.push(UserPage, { param1: null });
    this.dismissLoading();
  }

  logout(){
    let me = this;
    me.presentLoading();
    me.parse.logout();
    me.nav.setRoot(LoginPage);
    me.dismissLoading();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader = loader;
    loader.present();
  }

  dismissLoading(){
    if(this.loader){
      this.loader.dismiss().then((response) => {
        return response;
      }).then((response) => {
        console.info(response)
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  subscribeEvents(){
    
    this.events.subscribe('getUserEvent', user => {
      this.user = user.userParseObj;
    });

    //subscribe to connectivity-service-event
    this.events.subscribe('connectivity-service-event', message => {
      this.presentToast(message, "bottom");
    });

    //subscribe to error-handler-service-event
    this.events.subscribe('error-handler-service-event', message => {
      this.presentToast(message, "bottom");
    });
  }

  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2500,
      showCloseButton: true,
      position: position,
      dismissOnPageChange: false
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }
}