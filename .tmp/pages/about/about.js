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
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var AboutPage = (function () {
    function AboutPage(nav) {
        this.nav = nav;
        // working days
        this.days = [
            {
                'name': 'Monday',
                'hours': '02:00pm - 10:00pm'
            },
            {
                'name': 'Tuesday',
                'hours': '02:00pm - 10:00pm'
            },
            {
                'name': 'Wednesday',
                'hours': '02:00pm - 10:00pm'
            },
            {
                'name': 'Thursday',
                'hours': '02:00pm - 10:00pm'
            },
            {
                'name': 'Friday',
                'hours': '02:00pm - 10:00pm'
            },
            {
                'name': 'Saturday',
                'hours': '05:00pm - 10:00pm'
            },
            {
                'name': 'Sunday',
                'hours': '05:00pm - 10:00pm'
            }
        ];
    }
    AboutPage = __decorate([
        Component({
            selector: 'page-about',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/about/about.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>About</ion-title>\n    <ion-buttons end>\n      <button ion-button>\n        <ion-icon name="md-more"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding class="about gray-bg">\n  <h2 color="dark">El Gaucho restaurant </h2>\n  <span color="dark">225 Valencia St, San Francisco, CA</span>\n\n  <h3>About us</h3>\n\n  <p color="dark">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the\n    industry\'s\n    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make\n    a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,\n    remaining essentially unchanged</p>\n\n  <h3>Open hours</h3>\n\n  <ion-list class="list-full-border">\n    <ion-item *ngFor="let day of days">\n      <div>{{ day.name }}</div>\n      <span light-dark>{{ day.hours }}</span>\n    </ion-item>\n  </ion-list>\n\n  <h3>Get in touch</h3>\n\n  <ion-list class="list-full-border">\n    <ion-item>\n      <ion-icon name="call" item-left></ion-icon>\n      Call us\n    </ion-item>\n    <ion-item>\n      <ion-icon name="mail" item-left></ion-icon>\n      Send us and Email\n    </ion-item>\n    <ion-item>\n      <ion-icon name="navigate" item-left></ion-icon>\n      Find us / Get directions\n    </ion-item>\n  </ion-list>\n\n  <h4>Get social with us</h4>\n  <ion-list class="list-full-border">\n    <ion-item>\n      <ion-icon name="logo-facebook" item-left></ion-icon>\n      Visit us on Facebook\n    </ion-item>\n    <ion-item>\n      <ion-icon name="logo-instagram" item-left></ion-icon>\n      Follow us on Instagram\n    </ion-item>\n    <ion-item>\n      <ion-icon name="logo-twitter" item-left></ion-icon>\n      Follow us on Twitter\n    </ion-item>\n    <ion-item>\n      <ion-icon name="logo-pinterest" item-left></ion-icon>\n      Follow us on Pinterest\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/about/about.html"*/
        }), 
        __metadata('design:paramtypes', [NavController])
    ], AboutPage);
    return AboutPage;
}());
//# sourceMappingURL=about.js.map