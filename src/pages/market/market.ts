import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {Events} from 'ionic-angular';
import Parse from 'parse';

import {SellModal} from '../sell-modal/modal-content';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-market',
  templateUrl: 'market.html'
})
export class MarketPage {
  // slides for slider

  public loader: any;
  private start:number=0;

  public search: any;
  public find: any;

  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl:ModalController,
    public events: Events,
  ) {
    let me = this;
    this.search = {
      text:"",
      showCancel:false,
      placeholder:"Search Market",
      filter: {}
    };

  }

  openSellModal(post) {
    let modal = this.modalCtrl.create(SellModal,this);
    modal.present();
  }

  openFiltersModal(){
    console.log("Open filters modal");
  }

  queryMarket(){
    console.log("queryWeather");
    var me = this;
    this.presentLoading();
    if(this.search.text.length > 0){
      me.dismissLoading();
    }else{
      me.dismissLoading();
    }
  }

  onSearchFocus(event){
    console.log("ionFocus : " + event);

  }

  onSearchBlur(event){
    console.log("onSearchBlur : "+ event);

  }

  onSearchInput(event){
    console.log("onSearchInput " + event);

  }

  doInfinite(infiniteScroll) {
    var me = this;
    console.log('Begin async operation');
    // this.feedService.getFeed(this.start++).then((response) => {
    //   return response;
    // }).then((feed) => {
    //   me.feed = me.feed.concat(feed);
    //   console.log('Async operation has ended');
    //   infiniteScroll.complete();
    // }).catch((ex) => {
    //   console.error('Error : ', ex);
    // });
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
}
