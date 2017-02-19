import { Component } from '@angular/core';
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
  
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
    public parse: ParseProvider,
    public events: Events,
  ) {
    let me = this;

    // set data for feed
    this.status_model = {};
    this.comment_box_models = {};
    this.comments_models = {};
    this.subscribeFeedEvents();
  }

  subscribeFeedEvents(){
    let me = this;
    me.events.subscribe("updateFeedEvent", (feed) =>{
      console.log(feed);
      me.feed = feed;
    });
    me.events.subscribe("getFeedEvent", (feed) =>{
      console.log(feed);
      me.feed = feed;
      if(feed.posts.length == 0){
        me.parse.updateFeed();
      }
    });
    me.parse.getFeed();
  }

  alert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  

}
