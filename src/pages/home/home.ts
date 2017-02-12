import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service';

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

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public connectivityService: ConnectivityService,
  	public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public events: Events,
  ) {
  	this.subscribeEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  checkConnection(){
  	this.connectivityService.isOnline();
  }

  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2500,
      showCloseButton: true,
      position: position,
      dismissOnPageChange: false
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

  alert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  subscribeEvents(){
    //subscribe to connectivity-service-event
    this.events.subscribe('connectivity-service-event', message => {
      this.presentToast(message, "bottom");
    });

    //subscribe to error-handler-service-event
    this.events.subscribe('error-handler-service-event', message => {
      this.presentToast(message, "bottom");
    });
  }

}
