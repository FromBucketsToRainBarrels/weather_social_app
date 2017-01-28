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
import { ChatService } from '../../services/chat-service';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var ChatDetailPage = (function () {
    function ChatDetailPage(nav, chatService) {
        this.nav = nav;
        this.chatService = chatService;
        // get sample data only
        //this.chat = chatService.getItem(navParams.get('id'));
        this.chat = chatService.getItem(0);
    }
    ChatDetailPage = __decorate([
        Component({
            selector: 'page-chat-detail',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/chat-detail/chat-detail.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>ChatDetail</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <div *ngFor="let message of chat.messages" class="message-wrapper rlt"\n       (hold)="onMessageHold($event, $index, message)">\n\n    <div *ngIf="message.type == \'received\'">\n\n      <img class="profile-picture left" src="{{ chat.face }}"/>\n\n      <div class="chat-bubble left">\n\n        <div class="message">\n          {{ message.text }}\n          <img src="{{ message.image }}" class="block" *ngIf="message.image" alt=""/>\n        </div>\n\n        <div class="message-detail">\n          <span class="message-time">{{ message.time }}</span>\n        </div>\n\n      </div>\n    </div>\n\n    <div *ngIf="message.type == \'sent\'">\n\n      <img class="profile-picture right" src="assets/img/adam.jpg"/>\n\n      <div class="chat-bubble right">\n\n        <div class="message" ng-bind-html="message.text">\n          {{ message.text }}\n        </div>\n\n        <div class="message-detail">\n          <span class="message-time">{{ message.time }}</span>\n        </div>\n\n      </div>\n\n    </div>\n    <div class="clear"></div>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/chat-detail/chat-detail.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, ChatService])
    ], ChatDetailPage);
    return ChatDetailPage;
}());
//# sourceMappingURL=chat-detail.js.map