import {Component, ViewChild} from '@angular/core';
import { Content, Platform, NavParams, ViewController, AlertController, LoadingController, Events } from 'ionic-angular';

import { ParseProvider } from '../../providers/parse-provider';

@Component({
  templateUrl: 'modal-content.html',
  queries: {
      content: new ViewChild(Content)
  }
})

export class CommentsModal {

  public showSysncSpinner: boolean = true;
  public showCommentSpinner: boolean = false;
  public post: any;
  public comment_box_models: any;
  public comments: any;
  public loader: any;

  @ViewChild(Content) content: Content;

  //event listeners
  private getPostCommentsEvent: (comments) => void;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public parse: ParseProvider,
    public events: Events,
  ) {
    
    this.post = this.params.get('currPost');
    this.comment_box_models = this.params.get('comment_box_models');
    this.comments = this.params.get('comments');
    if(!this.comments[this.post.objectId]){this.comments[this.post.objectId]={}};
    if(!parse.user.userParseObj.saveData){parse.getPostComments(this.post,0)};
    this.showSysncSpinner = false;
  }

  scrollToBottom(x){
      this.content.scrollToBottom(x);
  }

  ionViewDidEnter(){
    this.scrollToBottom(300);
  }

  ionViewWillEnter(){
    this.initializeEventHandlers();
    this.subscribeEventHandlers();
  }

  ionViewWillLeave() {
    this.unsubscribeEventHandlers();
  }

  initializeEventHandlers(){
    this.initializeGetPostCommentsEventHandler();
  }

  subscribeEventHandlers(){
    this.events.subscribe('getPostCommentsEvent', this.getPostCommentsEvent);
  }

  unsubscribeEventHandlers(){
    this.unsubscribeGetPostCommentsEventHandler();
  }

  initializeGetPostCommentsEventHandler(){
    let me = this;
    this.getPostCommentsEvent = (data) => {
      me.comments[data.post.objectId].comments = data.c.comments;
      me.comments[data.post.objectId].start = data.c.start;
      me.showSysncSpinner = false;
      me.scrollToBottom(300);
    };
  }

  unsubscribeGetPostCommentsEventHandler(){
    if(this.getPostCommentsEvent){
      this.events.unsubscribe('getPostCommentsEvent', this.getPostCommentsEvent);
      this.getPostCommentsEvent = undefined;
    }
  }

  commentPost(post){
    var me = this;
    me.showCommentSpinner = true;
    if(me.comment_box_models[post.objectId] && me.comment_box_models[post.objectId].length != 0){
      let comment = me.comment(me.comment_box_models[post.objectId]);
      me.comments[post.objectId].comments.push(comment);
      me.comment_box_models[post.objectId] = "";
      me.events.publish('commentPostEvent',{comment:comment, post:post, comments:me.comments[post.objectId]});
    }
    me.showCommentSpinner = false;
    me.scrollToBottom(300);
  }

  fetchLatestComment(){
    let me = this;
    me.showSysncSpinner = true;
    me.parse.getPostComments(me.post,0);
    me.scrollToBottom(300);
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader = loader;
    loader.present();
  }

  dismissLoading(){
    this.loader.dismiss().catch(() => {});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  comment(c){
    let now = new Date();
    let comment = {
      createdAt: now,
      isDeleted: false,
      post: this.post,
      text: c,
      type: "text",
      updatedAt: now,
      user: this.parse.user.userParseObj,
      objectId: "comment_"+now.toString()
    }
    return comment;
  }
}