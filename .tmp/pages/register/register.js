var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import Parse from 'parse';
import { HomePage } from "../home/home";
import { LoginPage } from "../login/login";
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var RegisterPage = (function () {
    function RegisterPage(nav, loadingCtrl, alertCtrl) {
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.user = {};
    }
    // register and go to home page
    RegisterPage.prototype.register = function () {
        var me = this;
        this.presentLoading();
        if (this.user.username && this.user.password && this.user.repassword) {
            if (this.user.password == this.user.repassword) {
                //signup user
                var user = new Parse.User();
                user.set("username", this.user.username);
                user.set("password", this.user.repassword);
                // other fields can be set just like with Parse.Object
                user.set("userStatus", "ACTIVE");
                user.set("type", "APP_USER");
                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                        me.nav.setRoot(HomePage);
                    },
                    error: function (user, error) {
                        // Show the error message somewhere and let the user try again.
                        me.dismissLoading();
                        me.presentAlert("Error", error.code + " " + error.message, null);
                    }
                });
            }
            else {
                //Passwords dont match alert message
                me.dismissLoading();
                me.presentAlert("Error", "Passwords you enter do not match", null);
            }
        }
        else {
            //please enter all the fields message
            me.dismissLoading();
            me.presentAlert("Error", "Please enter all fields", null);
        }
    };
    // go to login page
    RegisterPage.prototype.login = function () {
        this.nav.setRoot(LoginPage);
    };
    RegisterPage.prototype.presentAlert = function (title, message, call) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (call) {
                            call();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    RegisterPage.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loader = loader;
        loader.present();
    };
    RegisterPage.prototype.dismissLoading = function () {
        this.loader.dismiss();
    };
    RegisterPage = __decorate([
        Component({
            selector: 'page-register',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/register/register.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-content class="auth-bg">\n  <div class="login-content">\n\n    <!-- Logo -->\n    <div padding text-center>\n      <img src="../../assets/icon/drawable-xxhdpi-icon.png">\n    </div>\n\n    <!-- Login form -->\n    <ion-list class="list-form" padding>\n      <ion-item>\n        <ion-label stacked>Username</ion-label>\n        <ion-input [(ngModel)]="user.username" type="text"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-label stacked>Password</ion-label>\n        <ion-input [(ngModel)]="user.password" type="password"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-label stacked>Re-enter Password</ion-label>\n        <ion-input [(ngModel)]="user.repassword" type="password"></ion-input>\n      </ion-item>\n    </ion-list>\n\n    <div margin-top>\n      <button ion-button block color="primary" (click)="register()">\n        SIGN UP\n      </button>\n    </div>\n\n    <!-- Other links -->\n    <div text-center margin-top>\n      <span color="light" (click)="login()">I have an account</span>\n    </div>\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/register/register.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, LoadingController, AlertController])
    ], RegisterPage);
    return RegisterPage;
}());
//# sourceMappingURL=register.js.map