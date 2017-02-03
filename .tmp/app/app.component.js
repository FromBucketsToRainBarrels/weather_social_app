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
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from 'ionic-native';
import { Events } from 'ionic-angular';
import Parse from 'parse';
import { HomePage } from '../pages/home/home';
import { WeatherPage } from '../pages/weather/weather';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { LogoutPage } from '../pages/logout/logout';
import { UserService } from '../services/user-service';
export var MyApp = (function () {
    function MyApp(platform, events, userService) {
        var _this = this;
        this.platform = platform;
        this.events = events;
        this.userService = userService;
        this.pages = [
            {
                title: 'Home',
                icon: 'ios-home-outline',
                count: 0,
                component: HomePage
            },
            {
                title: 'Weather',
                icon: 'ios-cloud',
                count: 0,
                component: WeatherPage
            },
            {
                title: 'Logout',
                icon: 'ios-exit-outline',
                count: 0,
                component: LogoutPage
            }
        ];
        this.rootPage = LoginPage;
        // Initialize Parse with your app's Application ID and JavaScript Key
        Parse.initialize('FromBucketsToRainBarrels');
        Parse.serverURL = 'http://162.243.118.87:1337/parse';
        events.subscribe('userFetch:complete', function (user) {
            _this.user = user[0];
        });
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            userService.getUserInfo();
        });
    }
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    // view my profile
    MyApp.prototype.viewMyProfile = function () {
        this.nav.setRoot(UserPage);
    };
    MyApp = __decorate([
        Component({template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/app/app.html"*/'<ion-menu [content]="content">\n\n  <ion-content class="menu-left">\n    <!-- User profile -->\n    <div text-center padding-top padding-bottom class="primary-bg menu-left">\n      <a menuClose (click)="viewMyProfile()">\n        <img class="profile-picture" src="{{user?.get(\'image\')?.url()}}">\n        <h4 color="light">{{user?.get(\'username\')}}</h4>\n      </a>\n    </div>\n\n    <ion-list class="list-full-border">\n      <button ion-item menuClose *ngFor="let page of pages" (click)="openPage(page)">\n        <ion-icon item-left name="{{ page.icon }}"></ion-icon>\n        {{ page.title }}\n        <ion-badge danger item-right *ngIf="page.count">{{ page.count }}</ion-badge>\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/app/app.html"*/,
            queries: {
                nav: new ViewChild('content')
            }
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof Platform !== 'undefined' && Platform) === 'function' && _a) || Object, (typeof (_b = typeof Events !== 'undefined' && Events) === 'function' && _b) || Object, (typeof (_c = typeof UserService !== 'undefined' && UserService) === 'function' && _c) || Object])
    ], MyApp);
    return MyApp;
    var _a, _b, _c;
}());
//# sourceMappingURL=app.component.js.map