import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Network } from 'ionic-native';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';

  
@Injectable()
export class ConnectivityService {

  connectSubscription: any;
  disconnectSubscription : any;
  onDevice: boolean;
  hasInternetAccess: boolean = true;
 
  constructor(
    public platform: Platform,
    public events: Events,
    public http: Http,
  ){

    this.testInternetAccess();
    this.onDevice = this.platform.is('cordova');

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
    if(this.onDevice && Network.type){
      return Network.type !== "none";
    } else {
      return navigator.onLine; 
    }
  }
 
  hasInernet(){
    return this.hasInternetAccess;
  }

  networkConnected(){
    let me = this;
    console.log("ConnectivityService -> networkConnected()");
    setTimeout(() => {
      me.testInternetAccess();
    }, 3000);
  }

  networkDisconnected(){
    this.hasInternetAccess = false;
    this.events.publish('connectivity-service-event', "Network was disconnected");
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
    let me = this;
    let url = 'http://162.243.118.87:4041/blank.org/';
    let headers = new Headers();
    headers.append('Pragma','no-cache');
    headers.append('Cache-Control','no-cache');
    headers.append('Expires',"0");
    
    this.http.get(url, {
        headers: headers
      })
      .timeout(2000, new Error('delay exceeded'))
      .map(res => res)
      .subscribe(data => {
        if(!me.hasInternetAccess){this.events.publish('connectivity-service-event:internet', true);}
        me.hasInternetAccess = true;          
      },
      err => {
        me.hasInternetAccess = false;
        this.events.publish('connectivity-service-event:internet', false);
      });

  }
}
