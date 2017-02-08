import {Component} from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import {Parse} from 'parse';

@Component({
  templateUrl: 'modal-content.html'
})

export class SellModal {

 
  public loader: any;
  public ad: any;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    
    let me = this;

    me.ad = {};
    // this.post = this.params.get('currPost');
    
  }

  addPost(){
    console.log("add post");
  }

  selectPic(){
    document.getElementById("ad_pic_upload").click();
  }

  getPic(fileInput: any){
    var me = this;

    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e : any) {
        if(e.target.result){
          me.ad.attachment_photo_src = e.target.result;
          me.ad.attachment_photo = true;
          var parseFile = new Parse.File( fileInput.target.files[0].name, { base64: e.target.result });
          me.ad.attachment_photo_parseFile = parseFile;
        }
      }
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage(){
    var me = this;
    me.ad.attachment_photo_src = null;
    me.ad.attachment_photo = false;
    me.ad.attachment_photo_parseFile = null;
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