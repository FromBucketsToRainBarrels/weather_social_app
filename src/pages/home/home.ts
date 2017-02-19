import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { ParseProvider } from '../../providers/parse-provider';
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

  public feed: any;
  public loader: any;
  public comment_box_models: any;
  public comments_models: any;
  public status_model: any;
  private currPost: any;
  private infiniteScroll: any;

  //event handlers
  private getMoreFeedEvent: (posts) => void;
  private updateFeedEvent: (feed) => void;
  private getFeedEvent: (feed) => void;
  
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
    public parse: ParseProvider,
    public events: Events,
    public cdr: ChangeDetectorRef,
  ) {
    let me = this;

    // set data for feed
    this.status_model = {};
    this.comment_box_models = {};
    this.comments_models = {};
  }

  ionViewWillEnter(){
    this.initializeEventHandlers();
    this.subscribeEventHandlers();
    this.parse.getFeed();
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
    me.parse.likePost(post,index);
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
        // me.cdr.detectChanges();
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
    };
  }

  subscribeEventHandlers(){
    this.events.subscribe('updateFeedEvent', this.updateFeedEvent);
    this.events.subscribe('getMoreFeedEvent', this.getMoreFeedEvent);
    this.events.subscribe('getFeedEvent', this.getFeedEvent);
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
  }

}
