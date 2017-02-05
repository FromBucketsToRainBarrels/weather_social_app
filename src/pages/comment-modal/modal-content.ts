import {Component} from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import {FeedService} from '../../services/socialmedia-service';


import Parse from 'parse';

@Component({
  templateUrl: 'modal-content.html'
})

export class CommentsModal {

  public post: any;
  public comment_box_models: any;
  public comments_models: any;
  public loader: any;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public feedService: FeedService,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {

    this.post = this.params.get('currPost');
    this.comment_box_models = this.params.get('comment_box_models');
    this.comments_models = this.params.get('comments_models');

    console.log("comment_box_models : " + this.comment_box_models);
    console.log("comments_models : " + this.comments_models);

  }

  addComment(post){
    var me = this;
    if(me.comment_box_models[post.id] && me.comment_box_models[post.id].length != 0){
      me.presentLoading();
      me.feedService.addComment(post,me.comment_box_models[post.id]).then((response) => {
        return response;
      }).then((p) => {
        me.comment_box_models[post.id] = "";
        me.dismissLoading();
      }).catch((ex) => {
        console.error('Error : ', ex);
        me.dismissLoading();
      });
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