import {Component} from '@angular/core';
import { Platform, NavParams, ViewController, AlertController, LoadingController, Events } from 'ionic-angular';

import { ParseProvider } from '../../providers/parse-provider';

@Component({
  templateUrl: 'modal-content.html'
})

export class CommentsModal {

  public post: any;
  public comment_box_models: any;
  public comments: any;
  public loader: any;

  //event listeners
  private getCommentsEvent: (comments) => void;

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
    
    if(!this.comments[this.post.objectId]){
      parse.getPostComments(this.post,0);
    }
  }

  ionViewWillEnter(){
    this.initializeEventHandlers();
    this.subscribeEventHandlers();
  }

  ionViewWillLeave() {
    this.unsubscribeEventHandlers();
  }

  initializeEventHandlers(){
    this.initializeGetCommentsEventHandler();
  }

  subscribeEventHandlers(){
    this.events.subscribe('getCommentsEvent', this.getCommentsEvent);
  }

  unsubscribeEventHandlers(){
    this.unsubscribeGetCommentsEventHandler();
  }

  initializeGetCommentsEventHandler(){
    let me = this;
    this.getCommentsEvent = (comments) => {
      // this.comments[data.post.objectId].comments = this.comments[data.post.objectId].comments.concat(data.comments);
      // this.comments[data.post.objectId].start++;
      me.comments = comments;
      console.log(comments);
    };
  }

  unsubscribeGetCommentsEventHandler(){
    if(this.getCommentsEvent){
      this.events.unsubscribe('getCommentsEvent', this.getCommentsEvent);
      this.getCommentsEvent = undefined;
    }
  }

  commentPost(post){
    console.log("commentPost");
    var me = this;
    if(me.comment_box_models[post.id] && me.comment_box_models[post.id].length != 0){
      me.presentLoading();
      // me.feedService.commentPost(post,me.comment_box_models[post.id]).then((response) => {
      //   return response;
      // }).then((p) => {
      //   me.comment_box_models[post.id] = "";
      //   me.dismissLoading();
      // }).catch((ex) => {
      //   console.error('Error : ', ex);
      //   me.dismissLoading();
      // });
    }
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
}