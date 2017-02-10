import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {HomePage} from "../home/home";
import {Events} from 'ionic-angular';
import Parse from 'parse';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public user: any;
  public loader: any;

  constructor(
    public nav: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public events: Events
  ) {
    this.user = {};
    
    if(Parse.User.current()){
      this.events.publish('userFetch:complete', Parse.User.current());
      this.nav.setRoot(HomePage);
    }
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

      Parse.User.logIn(this.user.username, this.user.password, {
        success: function(user) {
          //navigate to home page
          me.events.publish('userFetch:complete', Parse.User.current());
          // me.dismissLoading();
          me.nav.setRoot(HomePage);
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          me.dismissLoading();
          me.invalidCredentialsAlert();
        }
      });
    }else{
      me.dismissLoading();
      this.invalidCredentialsAlert();
    }
  }

  invalidCredentialsAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Invalid credentials',
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
    this.loader.dismiss().catch(() => {});
  }
}
