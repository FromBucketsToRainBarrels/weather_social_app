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
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { HomePage } from "../home/home";
import { Events } from 'ionic-angular';
import Parse from 'parse';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var LoginPage = (function () {
    function LoginPage(nav, viewCtrl, alertCtrl, loadingCtrl, events) {
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.events = events;
        this.user = {};
        if (Parse.User.current()) {
            this.events.publish('userFetch:complete', Parse.User.current());
            this.nav.setRoot(HomePage);
        }
    }
    // go to register page
    LoginPage.prototype.register = function () {
        this.nav.setRoot(RegisterPage);
    };
    // login and go to home page
    LoginPage.prototype.login = function () {
        var me = this;
        this.presentLoading();
        //this.presentLoading(); // dismiss not working for some reason ! :@
        if (this.user.username && this.user.password) {
            Parse.User.logIn(this.user.username, this.user.password, {
                success: function (user) {
                    //navigate to home page
                    me.events.publish('userFetch:complete', Parse.User.current());
                    // me.dismissLoading(); 
                    me.nav.setRoot(HomePage);
                },
                error: function (user, error) {
                    // The login failed. Check error to see why.
                    me.dismissLoading();
                    me.invalidCredentialsAlert();
                }
            });
        }
        else {
            me.dismissLoading();
            this.invalidCredentialsAlert();
        }
    };
    LoginPage.prototype.invalidCredentialsAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Invalid credentials',
            buttons: ['OK']
        });
        alert.present();
    };
    LoginPage.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loader = loader;
        loader.present();
    };
    LoginPage.prototype.dismissLoading = function () {
        this.loader.dismiss();
    };
    LoginPage = __decorate([
        Component({
            selector: 'page-login',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/login/login.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-content class="auth-bg">\n  <div class="login-content">\n\n    <!-- Logo -->\n    <div padding text-center>\n      <img src="../../assets/icon/drawable-xxhdpi-icon.png">\n    </div>\n\n    <!-- Login form -->\n    <ion-list class="list-form" padding>\n\n      <ion-item>\n        <ion-label stacked>Username</ion-label>\n        <ion-input [(ngModel)]="user.username" type="text"></ion-input>\n      </ion-item>\n\n      <ion-item>\n        <ion-label stacked>Password</ion-label>\n        <ion-input [(ngModel)]="user.password" type="password"></ion-input>\n      </ion-item>\n\n    </ion-list>\n\n    <!-- <p text-right color="light">Forgot Password?</p> -->\n\n    <div>\n      <button ion-button block color="primary" (click)="login()">\n        SIGN IN\n      </button>\n    </div>\n\n\n    <!-- Other links -->\n    <div text-center margin-top>\n      <span color="light" (click)="register()">New here? Sign up</span>\n    </div>\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/login/login.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, ViewController, AlertController, LoadingController, Events])
    ], LoginPage);
    return LoginPage;
}());
//# sourceMappingURL=login.js.map