import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ParseProvider } from '../../providers/parse-provider';
import Parse from 'parse';

import {HomePage} from "../home/home";
import {LoginPage} from "../login/login";



/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  public user: any;
  public loader: any;

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public parse: ParseProvider,
  ) {
    this.user = {};
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  // register and go to home page
  register() {
    var me = this;
    this.presentLoading();

    if(this.user.username && this.user.password && this.user.repassword){
      if(this.user.password == this.user.repassword){
        //signup user
        var user = new Parse.User();
        user.set("username", this.user.username);
        user.set("password", this.user.repassword);

        // other fields can be set just like with Parse.Object
        user.set("userStatus", "ACTIVE");
        user.set("type", "APP_USER");

        user.signUp(null, {
          success: function(user) {
            // Hooray! Let them use the app now.
            me.nav.setRoot(HomePage);
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            me.dismissLoading();
            me.presentAlert("Error",error.code + " " + error.message,null);
          }
        });
      }else{
        //Passwords dont match alert message
        me.dismissLoading();
        me.presentAlert("Error","Passwords you enter do not match",null);
      }
    }else{
      //please enter all the fields message
      me.dismissLoading();
      me.presentAlert("Error","Please enter all fields",null);
    }
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }

  presentAlert(title,message,call) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if(call){
              call();
            }
          }
        }
      ]
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

  dismissLoading(){
    this.loader.dismiss().catch(() => {});
  }
}
