import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import Parse from 'parse';

import {FeedService} from '../../services/socialmedia-service';
import {CommentsModal} from '../comment-modal/modal-content';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // slides for slider

  public feed: any;
  public loader: any;
  public comment_box_models: any;
  public comments_models: any;
  public status_model: any;
  private start:number=0;

  private currPost: any;

  constructor(
    public nav: NavController,
    public feedService: FeedService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl:ModalController,
    public events: Events,
  ) {
    let me = this;

    // set data for feed
    this.status_model = {};
    this.comment_box_models = {};
    this.comments_models = {};

    events.subscribe('comment_post_complete', comment => {
      console.log("Event : comment_post_complete");
      if(me.comments_models[comment.get("post").id]){
        me.comments_models[comment.get("post").id].comments.push(comment);
        me.comments_models[comment.get("post").id].show = true;
      }else{
        me.fetchComments(comment.get("post"));
      }
    });

    this.presentLoading();
    // feedService.getFeed(this.start++).then((response) => {
    //   return response;
    // }).then((feed) => {
    //   me.feed = feed;
    //   //me.dismissLoading();
    // }).catch((ex) => {
    //   console.error('Error : ', ex);
    //   me.dismissLoading();
    // });
  }

  doInfinite(infiniteScroll) {
    var me = this;
    console.log('Begin async operation');
    this.feedService.getFeed(this.start++).then((response) => {
      return response;
    }).then((feed) => {
      me.feed = me.feed.concat(feed);
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }).catch((ex) => {
      console.error('Error : ', ex);
    });
  }

  selectPic(){
    document.getElementById("profile_upload").click();
  }

  getPic(fileInput: any){
    var me = this;

    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e : any) {
        if(e.target.result){
          me.status_model.attachment_photo_src = e.target.result;
          me.status_model.attachment_photo = true;
          var parseFile = new Parse.File( fileInput.target.files[0].name, { base64: e.target.result });
          me.status_model.attachment_photo_parseFile = parseFile;
        }
      }
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage(){
    var me = this;
    me.status_model.attachment_photo_src = null;
    me.status_model.attachment_photo = false;
    me.status_model.attachment_photo_parseFile = null;
  }

  addPost(){
    var me = this;
    if(this.status_model.text || me.status_model.attachment_photo){
      var me = this;
      this.presentLoading();
      this.feedService.addPost(this.status_model).then((response) => {
        return response;
      }).then((post) => {
        me.status_model = {};
        me.feed.unshift(post);
        me.dismissLoading();
      }).catch((ex) => {
        console.error('Error : ', ex);
        me.dismissLoading();
      });
    }

  }

  getComments(post){
    var me = this;
    if(!me.comments_models[post.id]){
      me.fetchComments(post);
    }
  }

  fetchComments(post){
    var me = this;
    me.feedService.getComments(post).then((response) => {
      return response;
    }).then((comments) => {
      me.comments_models[post.id]={comments: comments, show: true};
      me.dismissLoading();
    }).catch((ex) => {
      console.error('Error : ', ex);
      me.dismissLoading();
    });
  }

  openCommentsModal(post) {
    this.currPost = post;
    // this.getComments(post);
    this.fetchComments(post);
    let modal = this.modalCtrl.create(CommentsModal,this);
    modal.present();
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

  setFocus(post){
    document.getElementById("post_comment_"+post.id).getElementsByTagName('input')[0].focus();
  }
}
