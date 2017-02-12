import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  	public connectivityService: ConnectivityService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  checkConnection(){
  	alert(this.connectivityService.isOnline());
  }

}
