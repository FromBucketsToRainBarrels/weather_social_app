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
import { ChatDetailPage } from "../chat-detail/chat-detail";
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var ChatsPage = (function () {
    function ChatsPage(nav, chatService) {
        this.nav = nav;
        this.chatService = chatService;
        // get sample data only
        this.chats = chatService.getAll();
    }
    ChatsPage.prototype.viewChat = function (id) {
        this.nav.push(ChatDetailPage, { id: id });
    };
    ChatsPage = __decorate([
        Component({
            selector: 'page-chats',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/chats/chats.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Chats</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <ion-list class="list-full-border">\n    <ion-item-sliding *ngFor="let chat of chats">\n\n      <ion-item text-wrap (click)="viewChat(chat.id)">\n        <ion-avatar item-left>\n          <img class="profile-picture" src="{{ chat.face }}" alt=""/>\n        </ion-avatar>\n        <h2 color="primary">{{chat.name}}</h2>\n        <p>{{chat.lastText}}</p>\n      </ion-item>\n\n      <ion-item-options>\n        <button ion-button color="secondary">\n          Mute\n        </button>\n        <button ion-button color="danger">\n          Delete\n        </button>\n      </ion-item-options>\n    </ion-item-sliding>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/chats/chats.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, ChatService])
    ], ChatsPage);
    return ChatsPage;
}());
//# sourceMappingURL=chats.js.map