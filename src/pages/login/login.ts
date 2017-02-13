import {Component} from '@angular/core';
import {NavController, MenuController, ToastController, Events, LoadingController, ViewController, AlertController} from 'ionic-angular';

import {RegisterPage} from "../register/register";
import {HomePage} from "../home/home";

import { ParseProvider } from '../../providers/parse-provider';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

declare var window: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public user: any;
  public loader: any;

  constructor(
    public nav: NavController,
    public menu: MenuController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public parse: ParseProvider,
    private toastCtrl: ToastController
  ) {    
    let me = this;
    me.subscribeEvents();
    me.user ={};
    if(me.parse.getCurrentUser()){
      me.nav.setRoot(HomePage);
    }
  }

  ionViewWillLeave() {
    this.menu.enable(true);
    this.unsubscribeEvents();
  }

  ionViewWillEnter() {
    this.menu.enable(false);
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
    });

    toast.present();
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    var me = this;
    me.presentLoading();
    //this.presentLoading(); // dismiss not working for some reason ! :@
    if(this.user.username && this.user.password){
      me.parse.login(this.user.username,this.user.password,this);
    }else{
      this.presentToast("Credentials missing", "bottom")
      me.dismissLoading(me);
    }
  }

  alert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader = loader;
    loader.present();
  }

  dismissLoading(context){
    if(context.loader){
      context.loader.dismiss().then((response) => {
        return response;
      }).then((response) => {
      }).catch((error) => {
        console.error(error);
      });
    }
      
  }

  subscribeEvents(){
    let me = this;
    this.events.subscribe('loginSuccess', me.goToHome);
    this.events.subscribe('loginFail', me.dismissLoading);
  }

  unsubscribeEvents(){
    let me = this;
    this.events.unsubscribe('loginSuccess', me.goToHome);
    this.events.unsubscribe('loginFail', me.dismissLoading);
  }

  goToHome(context){
    context.nav.setRoot(HomePage);
    context.dismissLoading(context);
  }
}
