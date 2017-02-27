import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController, ViewController} from 'ionic-angular';
import {HomePage} from "../home/home";
import { ParseProvider } from '../../providers/parse-provider';
import { ImageService } from '../../providers/image-service';
import Parse from 'parse';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  public user : any = null;
  public loader: any;

  constructor(public nav: NavController,
  	public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public parse: ParseProvider,
    public imageSerive: ImageService
  ) {
  	this.user = this.parse.user.userParseObj;
  	console.log(this.user);
  }

  	uploadPic(){
		document.getElementById("profile_upload").click();
	}

	doUploadProfilePic(fileInput: any){
		var me = this;
		me.imageSerive.getImage(fileInput).then((img) => {
			if(!this.parse.user.userParseObj.image)me.user.image = {};
			this.parse.user.userParseObj.image = img
        }).catch((ex) => {
        	console.error(ex);
        });
	}

	save(){
		let me = this;
		this.presentLoading();
		this.parse.saveUser();
		me.dismissLoading();
	}

	presentAlert(title,message,call) {
    	let alert = this.alertCtrl.create({
	      title: title,
	      subTitle: message,
	      buttons: [
	        {
	          text: 'OK',
	          handler: data => {
	            if(call){
	              call();
	            }
	          }
	        }
	      ]
	    });
	    alert.present();
	}

	presentLoading() {
	    let loader = this.loadingCtrl.create({
	      content: "Please wait..."
	    });
	    this.loader = loader;
	    loader.present();
	}

	dismissLoading(){
	    this.loader.dismiss().catch(() => {});
	}
}
