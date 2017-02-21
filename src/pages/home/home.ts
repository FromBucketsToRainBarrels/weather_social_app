import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController, Events, ModalController, PopoverController } from 'ionic-angular';
import { ParseProvider } from '../../providers/parse-provider';

import {CommentsModal} from '../comment-modal/modal-content';
import {PopoverPage} from '../../components/home-card-popover/home-card-popover';
import { ImageService } from '../../providers/image-service';
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // feed is a map object with structure {posts: Array<Post>, start:int}
  // start has the current paginantion value
  public feed: any;

  // {} set of post commets with key post.objectId 
  // each object has structure {start:int , comment: Array<Comment>}
  // start has the current paginantion value
  public comments: any;
  
  public loader: any;
  public comment_box_models: any;
  public status_model: any;
  private currPost: any;
  private infiniteScroll: any;
  private find: any;

  //page event handlers
  private getMoreFeedEvent: (posts) => void;
  private updateFeedEvent: (feed) => void;
  private getFeedEvent: (feed) => void;
  private postLikeEvent: (data) => void;
  private getCommentsEvent: (comments) => void;
  private getPostCommentsEvent: (comments) => void;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
    public parse: ParseProvider,
    public events: Events,
    public cdr: ChangeDetectorRef,
    public modalCtrl:ModalController,
    public popoverCtrl: PopoverController,
    public imageSerive: ImageService
  ) {

    let me = this;
    this.status_model = {};
    this.comment_box_models = {};
    this.comments = {};
  }

  ionViewWillEnter(){
    this.initializeEventHandlers();
    this.subscribeEventHandlers();
    this.parse.getFeed();
    this.parse.getComments();
  }

  ionViewWillLeave() {
    this.unsubscribeEventHandlers();
  }

  doInfinite(infiniteScroll) {
    var me = this;
    me.infiniteScroll = infiniteScroll;
    me.parse.getMoreFeed(me.feed.start);
  }

  likePost(post,index){
    let me = this;
    if(post.liked){
      post.likes_count--;
    }else{
      post.likes_count++;
    }
    post.liked = !post.liked;
    me.parse.saveFeed(me.feed);
    me.parse.likePost(post,index);
  }

  openCommentsModal(post) {
    this.currPost = post;
    // this.getComments(post);
    let modal = this.modalCtrl.create(CommentsModal,this);
    modal.present();
  }

  presentPopover(myEvent,post) {
    let popover = this.popoverCtrl.create(PopoverPage, post);
    popover.present({
      ev: myEvent
    });
  }

  selectStatusPic(){
    document.getElementById("status_pic").click();
  }

  addPost(){
    let me = this;
    if(this.status_model.text || me.status_model.attachment_photo){
      let post = this.parse.addPost(this.status_model);
      me.status_model = {};
      me.feed.posts.unshift(post);
      me.parse.saveFeed(me.feed);
    }
  }

  doUploadStatusPic(fileInput: any){
    let me = this;
    let img = {};
    me.imageSerive.getImage(fileInput).then((img) => {
      if(img){
        img["fileInput"] = fileInput;
        me.status_model.img = img;
        console.log(me.status_model);
      }
    }).catch((ex) => {
      console.error(ex);
    });
  }

  removeImage(){
    var me = this;
    me.status_model.attachment_photo_src = null;
    me.status_model.attachment_photo = false;
    me.status_model.attachment_photo_parseFile = null;
  }

  alert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  initializeEventHandlers(){
    let me = this;
    this.getMoreFeedEvent = (posts) => {
      if(posts.length!=0){
        me.feed.posts = me.feed.posts.concat(posts);
        me.feed.start++;
        me.parse.saveFeed(me.feed);
        me.cdr.detectChanges();
      }
      me.infiniteScroll.complete();
    };
    this.updateFeedEvent = (feed) => {
      console.log(feed);
      me.feed = feed;
      me.cdr.detectChanges();
    };
    this.getFeedEvent = (feed) => {
      console.log(feed);
      me.feed = feed;
      me.cdr.detectChanges();
    };

    this.postLikeEvent = (data) => {
      if(me.feed.posts[data.index].objectId == data.post.objectId){
        me.feed.posts[data.index].likes_count = data.count;
        me.feed.posts[data.index].liked = data.liked;
        me.parse.saveFeed(me.feed);
      }else{
        //need to find the and update the post object in feeds array
        me.find = data.post;
        var index = me.feed.posts.findIndex(function(x) { return x.objectId == me.find.objectId; });
        if(index != -1){
          //found the post object now update it and save the feed back to local storage
          me.feed.posts[data.index].likes_count = data.count;
          me.feed.posts[data.index].liked = data.liked;
          me.parse.saveFeed(me.feed);
        }
      }
    }
    this.initializeGetCommentsEventHandler();
    this.initializeGetPostCommentsEventHandler();
  }

  initializeGetCommentsEventHandler(){
    let me = this;
    this.getCommentsEvent = (comments) => {
      console.log(comments);
      me.comments = comments;
    };
  }

  initializeGetPostCommentsEventHandler(){
    let me = this;
    this.getPostCommentsEvent = (data) => {
      me.find = data.post;
      var index = me.feed.posts.findIndex(function(x) { return x.objectId == me.find.objectId; });
      if(index!=-1){
        me.feed.posts[index].comments_count = data.c.comments.length;
        me.parse.saveFeed(me.feed);
      }      
      me.comments[data.post.objectId].comments = data.c.comments;
      me.comments[data.post.objectId].start = data.c.start;
    };
  }

  subscribeEventHandlers(){
    this.events.subscribe('updateFeedEvent', this.updateFeedEvent);
    this.events.subscribe('getMoreFeedEvent', this.getMoreFeedEvent);
    this.events.subscribe('getFeedEvent', this.getFeedEvent);
    this.events.subscribe('postLikeEvent', this.postLikeEvent);
    this.events.subscribe('getCommentsEvent', this.getCommentsEvent);
    this.events.subscribe('getPostCommentsEvent', this.getPostCommentsEvent);
  }

  unsubscribeEventHandlers(){
    if (this.updateFeedEvent) {
      this.events.unsubscribe('updateFeedEvent', this.updateFeedEvent);
      this.updateFeedEvent = undefined;
    }
    if (this.getMoreFeedEvent) {
      this.events.unsubscribe('getMoreFeedEvent', this.getMoreFeedEvent);
      this.getMoreFeedEvent = undefined;
    }
    if (this.getFeedEvent) {
      this.events.unsubscribe('getFeedEvent', this.getFeedEvent);
      this.getFeedEvent = undefined;
    }
    if(this.postLikeEvent){
      this.events.unsubscribe('postLikeEvent', this.postLikeEvent);
      this.postLikeEvent = undefined;
    }
    if(this.getCommentsEvent){
      this.events.unsubscribe('getCommentsEvent', this.getCommentsEvent);
      this.getCommentsEvent = undefined;
    }
    this.unsubscribeGetPostCommentsEventHandler();
  }

  unsubscribeGetPostCommentsEventHandler(){
    if(this.getPostCommentsEvent){
      this.events.unsubscribe('getPostCommentsEvent', this.getPostCommentsEvent);
      this.getPostCommentsEvent = undefined;
    }
  }

}
