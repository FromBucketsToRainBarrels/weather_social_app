import {Component} from '@angular/core';
import {NavController, MenuController, ToastController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {HomePage} from "../home/home";
import {Events} from 'ionic-angular';

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
    me.user ={};
    if(me.parse.getCurrentUser()){
      me.nav.setRoot(HomePage);
    }
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      showCloseButton: true,
      position: position,
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
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
    this.presentLoading();
    //this.presentLoading(); // dismiss not working for some reason ! :@
    if(this.user.username && this.user.password){
      me.parse.login(this.user.username,this.user.password).then((response) => {
        return response;
      }).then((response) => {
        me.nav.setRoot(HomePage);
      }).catch((ex) => {
        me.dismissLoading();
        this.presentToast(ex, "bottom")
      }); 

    }else{
      me.dismissLoading();
      this.presentToast("Credentials missing", "bottom")
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
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader = loader;
    loader.present();
  }

  dismissLoading(){
    this.loader.dismiss().then((response) => {
      return response;
    }).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error);
    });
  }
}
