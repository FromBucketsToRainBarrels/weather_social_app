import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {HomePage} from "../home/home";
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
    public loadingCtrl: LoadingController
  ) {
  	this.user = {};
  	this.user = JSON.parse(JSON.stringify(Parse.User.current()));
  	console.log(this.user);
  }

  	uploadPic(){
		document.getElementById("profile_upload").click();
	}

	doUploadProfilePic(fileInput: any){
		var me = this;
		if (fileInput.target.files && fileInput.target.files[0]) {
		  var reader = new FileReader();
		  
		  reader.onload = function (e : any) {
		      if(e.target.result){
		      	if(!me.user.image)me.user.image = {};
		      	me.user.image.url = e.target.result;
		      	me.user.upload_new_image = true;
		      	var parseFile = new Parse.File( fileInput.target.files[0].name, { base64: e.target.result });
		      	me.user.parseImageFile = parseFile;
		      }else{
		      	me.user.upload_new_image = false;		      	
		      }
		  }
		  reader.readAsDataURL(fileInput.target.files[0]);
		}
	}

	cancel(){
		var me = this;
		me.user = JSON.parse(JSON.stringify(Parse.User.current()));
		this.nav.setRoot(HomePage);
	}

	save(){
		this.presentLoading();
		var me = this;
		var user = Parse.User.current();
		user.set("name",me.user.name);
		user.set("phone",me.user.phone);
		user.set("email",me.user.email);
		if(me.user.upload_new_image){
			user.set("image",me.user.parseImageFile);
		}
		user.save(null,{
			success: function(user){
				me.dismissLoading();
				me.user = JSON.parse(JSON.stringify(user));
				me.presentAlert("Update ","Complete ",null);
			},
			error: function(user,error){
				console.log("Error : " + error.message);
				me.dismissLoading();
				me.presentAlert("Error",error.message,null);
			}
		});
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
	      content: "Please wait...",
	      dismissOnPageChange: true
	    });
	    this.loader = loader;
	    loader.present();
	  }

	  dismissLoading(){
	    this.loader.dismiss();
	  }

}
