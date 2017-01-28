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
import { Events } from 'ionic-angular';
import Parse from 'parse';
import { FeedService } from '../../services/socialmedia-service';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var HomePage = (function () {
    function HomePage(nav, feedService, alertCtrl, loadingCtrl, events) {
        var _this = this;
        this.nav = nav;
        this.feedService = feedService;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.events = events;
        this.start = 0;
        events.subscribe('comment_post_complete', function (comment) {
            console.log("Event : comment_post_complete");
            if (_this.comments_models[comment[0].get("post").id]) {
                _this.comments_models[comment[0].get("post").id].comments.unshift(comment[0]);
            }
        });
        // set data for feed
        var me = this;
        this.status_model = {};
        this.comment_box_models = {};
        this.comments_models = {};
        this.presentLoading();
        feedService.getFeed(this.start++).then(function (response) {
            return response;
        }).then(function (feed) {
            console.log("posts count : " + feed);
            me.feed = feed;
            me.dismissLoading();
        }).catch(function (ex) {
            console.error('Error : ', ex);
            me.dismissLoading();
        });
    }
    HomePage.prototype.doInfinite = function (infiniteScroll) {
        var me = this;
        console.log('Begin async operation');
        this.feedService.getFeed(this.start++).then(function (response) {
            return response;
        }).then(function (feed) {
            me.feed = me.feed.concat(feed);
            console.log('Async operation has ended');
            infiniteScroll.complete();
        }).catch(function (ex) {
            console.error('Error : ', ex);
        });
    };
    HomePage.prototype.selectPic = function () {
        document.getElementById("profile_upload").click();
    };
    HomePage.prototype.getPic = function (fileInput) {
        var me = this;
        if (fileInput.target.files && fileInput.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (e.target.result) {
                    me.status_model.attachment_photo_src = e.target.result;
                    me.status_model.attachment_photo = true;
                    var parseFile = new Parse.File(fileInput.target.files[0].name, { base64: e.target.result });
                    me.status_model.attachment_photo_parseFile = parseFile;
                }
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    };
    HomePage.prototype.removeImage = function () {
        var me = this;
        me.status_model.attachment_photo_src = null;
        me.status_model.attachment_photo = false;
        me.status_model.attachment_photo_parseFile = null;
    };
    HomePage.prototype.addPost = function () {
        var me = this;
        if (this.status_model.text || me.status_model.attachment_photo) {
            var me = this;
            this.presentLoading();
            this.feedService.addPost(this.status_model).then(function (response) {
                return response;
            }).then(function (post) {
                me.status_model = {};
                me.feed.unshift(post);
                me.dismissLoading();
            }).catch(function (ex) {
                console.error('Error : ', ex);
                me.dismissLoading();
            });
        }
    };
    HomePage.prototype.getComments = function (post) {
        var me = this;
        if (me.comments_models[post.id]) {
            me.comments_models[post.id].show = !(me.comments_models[post.id].show);
        }
        else {
            this.feedService.getComments(post).then(function (response) {
                return response;
            }).then(function (comments) {
                me.comments_models[post.id] = { comments: comments, show: true };
                me.dismissLoading();
            }).catch(function (ex) {
                console.error('Error : ', ex);
                me.dismissLoading();
            });
        }
    };
    HomePage.prototype.addComment = function (post) {
        var me = this;
        if (this.comment_box_models[post.id] && this.comment_box_models[post.id].length != 0) {
            this.presentLoading();
            this.feedService.addComment(post, this.comment_box_models[post.id]).then(function (response) {
                return response;
            }).then(function (p) {
                me.comment_box_models[post.id] = "";
                me.dismissLoading();
            }).catch(function (ex) {
                console.error('Error : ', ex);
                me.dismissLoading();
            });
        }
    };
    HomePage.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loader = loader;
        loader.present();
    };
    HomePage.prototype.dismissLoading = function () {
        this.loader.dismiss();
    };
    HomePage.prototype.setFocus = function (post) {
        document.getElementById("post_comment_" + post.id).getElementsByTagName('input')[0].focus();
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/home/home.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Home</ion-title>\n    <ion-buttons end>\n      <button ion-button>\n        <ion-icon name="md-more"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <!-- new status card goes here -->\n  <ion-card>\n\n    <div *ngIf="status_model.attachment_photo">\n      <ion-item>\n        <ion-thumbnail item-left>\n          <img  src="{{status_model.attachment_photo_src}}"/>\n        </ion-thumbnail>\n        <ion-icon name="ios-trash" item-right (click)="removeImage()" ></ion-icon>\n      </ion-item>\n    </div>\n    \n    <ion-card-content style="background-color: #8db9ea;">\n      <ion-item >\n       <ion-label floating>Whats on your mind ....</ion-label>\n       <ion-textarea elastic [(ngModel)]="status_model.text" ></ion-textarea>\n      </ion-item>\n      <ion-list >\n        <ion-item style="background-color: #8db9ea;">\n          <button ion-button outline round (click)="selectPic()">\n            <ion-icon name="ios-camera"></ion-icon>\n          </button>\n          <input hidden="true" id="profile_upload" (change)="getPic($event)" type="file">\n          \n          <button ion-button outline item-right icon-left round (click)="addPost()">\n            <ion-icon name="ios-send"></ion-icon>\n            Post\n          </button>\n        </ion-item>\n      </ion-list>\n    </ion-card-content>\n  </ion-card>\n  \n  <div *ngFor="let post of feed">\n    <ion-card style="background-color: #8db9ea;" >\n      <ion-card >\n        <ion-item>\n          <ion-avatar item-left>\n            <img src="{{post.get(\'user\').get(\'image\')?.url()}}">\n          </ion-avatar>\n          <h2>{{post.get("user").get("username")}}</h2>\n        </ion-item>\n        <ion-item *ngIf="post.get(\'type\')== \'photo\'">\n          <ion-thumbnail item-left>\n            <img  src="{{post.get(\'images\')[0]}}" imageViewer/>\n          </ion-thumbnail>\n        </ion-item>\n\n        <ion-card-content>\n          <p>{{post.get("text")}}</p>\n        </ion-card-content>\n\n        <ion-list >\n          <ion-item >\n            <button ion-button icon-left clear small (click)="feedService.likeUnlikePost(post)">\n              <ion-icon name="thumbs-up"></ion-icon>\n              <div>{{post.get("likes_count")}} Likes</div>\n            </button>\n            <button ion-button icon-left clear small (click)="setFocus(post)">\n              <ion-icon name="text"></ion-icon>\n              <div>Comment</div>\n            </button>\n          </ion-item>\n        </ion-list>\n          \n        <ion-list *ngIf="post.get(\'comments_count\')!=0">\n            \n            <ion-item (click)="getComments(post)">\n              <small><a href="#">{{post.get(\'comments_count\')}} comments</a></small>\n            </ion-item>\n            \n            \n            <div *ngIf="comments_models[post.id] && comments_models[post.id].show">\n              <ion-item *ngFor="let comment of comments_models[post.id].comments" text-wrap>\n                <ion-avatar item-left>\n                  <img src="{{comment.get(\'user\').get(\'image\')?.url()}}">\n                </ion-avatar>\n                <strong><small>{{comment.get("user").get("username")}}</small></strong><br>\n                <small>{{comment.get("text")}}</small>\n              </ion-item>\n            </div>\n            \n        </ion-list>\n\n        <ion-list *ngIf="post.get(\'comments_count\')==0">\n            <ion-item (click)="setFocus(post)">\n              <small><a href="#">Be the first one to comment</a></small>\n            </ion-item>\n        </ion-list>\n\n        <ion-list >\n           <ion-item style="background-color: #b7c7e0;">\n              <ion-item >\n                <ion-input id="post_comment_{{post.id}}" placeholder="Write a comment" [(ngModel)]="comment_box_models[post.id]"></ion-input>\n                <button ion-button round item-right icon-left (click)="addComment(post)">\n                  <ion-icon name="ios-send"></ion-icon>\n                </button>\n              </ion-item>\n           </ion-item>\n          \n        </ion-list>\n      </ion-card>\n    </ion-card>\n    \n  </div>\n\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n   <ion-infinite-scroll-content></ion-infinite-scroll-content>\n </ion-infinite-scroll>\n\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/home/home.html"*/
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof NavController !== 'undefined' && NavController) === 'function' && _a) || Object, (typeof (_b = typeof FeedService !== 'undefined' && FeedService) === 'function' && _b) || Object, (typeof (_c = typeof AlertController !== 'undefined' && AlertController) === 'function' && _c) || Object, (typeof (_d = typeof LoadingController !== 'undefined' && LoadingController) === 'function' && _d) || Object, (typeof (_e = typeof Events !== 'undefined' && Events) === 'function' && _e) || Object])
    ], HomePage);
    return HomePage;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=home.js.map