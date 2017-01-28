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
import { HomePage } from "../home/home";
import Parse from 'parse';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var UserPage = (function () {
    function UserPage(nav, viewCtrl, alertCtrl, loadingCtrl) {
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.user = {};
        this.user = JSON.parse(JSON.stringify(Parse.User.current()));
        console.log(this.user);
    }
    UserPage.prototype.uploadPic = function () {
        document.getElementById("profile_upload").click();
    };
    UserPage.prototype.doUploadProfilePic = function (fileInput) {
        var me = this;
        if (fileInput.target.files && fileInput.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (e.target.result) {
                    if (!me.user.image)
                        me.user.image = {};
                    me.user.image.url = e.target.result;
                    me.user.upload_new_image = true;
                    var parseFile = new Parse.File(fileInput.target.files[0].name, { base64: e.target.result });
                    me.user.parseImageFile = parseFile;
                }
                else {
                    me.user.upload_new_image = false;
                }
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    };
    UserPage.prototype.cancel = function () {
        var me = this;
        me.user = JSON.parse(JSON.stringify(Parse.User.current()));
        this.nav.setRoot(HomePage);
    };
    UserPage.prototype.save = function () {
        this.presentLoading();
        var me = this;
        var user = Parse.User.current();
        user.set("name", me.user.name);
        user.set("phone", me.user.phone);
        user.set("email", me.user.email);
        if (me.user.upload_new_image) {
            user.set("image", me.user.parseImageFile);
        }
        user.save(null, {
            success: function (user) {
                me.dismissLoading();
                me.user = JSON.parse(JSON.stringify(user));
                me.presentAlert("Update ", "Complete ", null);
            },
            error: function (user, error) {
                console.log("Error : " + error.message);
                me.dismissLoading();
                me.presentAlert("Error", error.message, null);
            }
        });
    };
    UserPage.prototype.presentAlert = function (title, message, call) {
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
    UserPage.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loader = loader;
        loader.present();
    };
    UserPage.prototype.dismissLoading = function () {
        this.loader.dismiss();
    };
    UserPage = __decorate([
        Component({
            selector: 'page-user',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/user/user.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>User</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <!-- Cover and profile picture -->\n  <div class="profile-cover">\n    <ion-grid>\n      <ion-row>\n        <ion-col width-33 text-center (click)="uploadPic()">\n          <img class="profile-picture circle" src="{{user?.image?.url}}">\n        </ion-col>\n\n        <ion-col width-66>\n          <h3 padding no-margin color="light">{{user.username}}</h3>\n          <input hidden="true" id="profile_upload" (change)="doUploadProfilePic($event)" type="file">\n        </ion-col>\n\n      </ion-row>\n    </ion-grid>\n  </div>\n\n  <!-- User information -->\n  <ion-list class="list-full-border">\n\n    <ion-item>\n      <ion-label stacked color="primary">Name</ion-label>\n      <ion-input [(ngModel)]="user.name"  type="text"></ion-input>\n    </ion-item>\n\n    <ion-item>\n      <ion-label stacked color="primary">Phone</ion-label>\n      <ion-input type="text" [(ngModel)]="user.phone"></ion-input>\n    </ion-item>\n\n    <ion-item>\n      <ion-label stacked color="primary">Email</ion-label>\n      <ion-input type="text" [(ngModel)]="user.email"></ion-input>\n    </ion-item>\n\n  </ion-list>\n</ion-content>\n\n<!--bottom buttons-->\n<ion-footer>\n  <ion-grid no-padding>\n    <ion-row class="item-button-group" no-padding>\n      <ion-col no-padding>\n        <button ion-button block color="gray" (click)="cancel()">\n          Cancel\n        </button>\n      </ion-col>\n      <ion-col no-padding>\n        <button ion-button block (click)="save()">\n          Save\n        </button>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n</ion-footer>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/user/user.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, ViewController, AlertController, LoadingController])
    ], UserPage);
    return UserPage;
}());
//# sourceMappingURL=user.js.map