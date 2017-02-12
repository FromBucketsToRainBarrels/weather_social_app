import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Network } from 'ionic-native';
import {Http} from '@angular/http';
import 'rxjs/Rx';

  
@Injectable()
export class ConnectivityService {

  connectSubscription: any;
  disconnectSubscription : any;
  onDevice: boolean;
  hasInternetAccess: boolean;
 
  constructor(
    public platform: Platform,
    public events: Events,
    public http: Http,
  ){

    this.testInternetAccess();

    this.onDevice = this.platform.is('cordova');
    console.log("this.onDevice : " + this.onDevice);

    // watch network for a disconnect
    document.addEventListener("offline", this.networkDisconnected, false);
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      this.networkDisconnected();
    });

    // watch network for a connection
    document.addEventListener("online", this.networkConnected, false);
    this.connectSubscription = Network.onConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
       // before we determine the connection type.  Might need to wait 
      // prior to doing any api requests as well.
      this.networkConnected();
    });
  }

  hasNetwork(){
    console.log("device : " + this.onDevice);
    this.events.publish('connectivity-service-event', "Network : " + Network.type + " onDevice : " + this.onDevice);
    if(this.onDevice && Network.type){
      return Network.type !== "none";
    } else {
      return navigator.onLine; 
    }
  }
 
  hasInernet(): boolean {
    console.log("checking internet access");
    if(!this.hasInternetAccess){
      this.testInternetAccess();
    }
    return this.hasInternetAccess;
  }

  networkConnected(){
    let me = this;
    setTimeout(() => {
      if (Network.type === 'wifi') {
        me.events.publish('connectivity-service-event', Network.type + " connected");
      }
    }, 3000);
  }

  networkDisconnected(){
    this.events.publish('connectivity-service-event', "Network was disconnected");
    console.log('network was disconnected :-(');
  }

  noInternetAccess(){
    this.events.publish('connectivity-service-event', "No internet access");
  }

  stopNetworkDisconnectWatch(){
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
  }

  stopNetworkConnectWatch(){
    // stop connect watch
    this.connectSubscription.unsubscribe();
  }

  testInternetAccess(){
      console.log("testInternetAccess()");
      let me = this;
      var url = 'http://blank.org/';
      
      this.http.get(url)
      .timeout(2000, new Error('delay exceeded'))
      .map(res => res)
      .subscribe(data => {
        me.hasInternetAccess = true;
        console.log("internet access is good");
      },
      err => {
        me.hasInternetAccess = false;
        console.log("no internet access");
      });
  }
}
