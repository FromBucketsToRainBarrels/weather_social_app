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
import { LoginPage } from "../login/login";
import Parse from 'parse';
/*
 Generated class for the LogoutPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var LogoutPage = (function () {
    function LogoutPage(nav) {
        this.nav = nav;
        Parse.User.logOut();
        this.nav.setRoot(LoginPage);
    }
    LogoutPage = __decorate([
        Component({
            selector: 'page-logout',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/logout/logout.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-content class="auth-bg">\n  \n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/logout/logout.html"*/
        }), 
        __metadata('design:paramtypes', [NavController])
    ], LogoutPage);
    return LogoutPage;
}());
//# sourceMappingURL=logout.js.map