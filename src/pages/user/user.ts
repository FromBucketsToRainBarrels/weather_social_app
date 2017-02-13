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

  public user : any;
  public loader: any;

  constructor(public nav: NavController,
  	public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public parse: ParseProvider,
    public imageSerive: ImageService
  ) {
  	this.user = parse.getUserAsJSON();
  }

  	uploadPic(){
		document.getElementById("profile_upload").click();
	}

	doUploadProfilePic(fileInput: any){
		var me = this;
		me.imageSerive.getImage(fileInput).then((img) => {
			console.log(img);
			if(!me.user.image)me.user.image = {};
			me.user.image = img
        }).catch((ex) => {
        	console.error(ex);
        });
	}

	cancel(){
		var me = this;
		me.user = JSON.parse(JSON.stringify(Parse.User.current()));
		this.nav.setRoot(HomePage);
	}

	save(){
		let me = this;
		this.presentLoading();
		this.parse.saveUserFromJSON(me.user);
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
