import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import { Platform, Events } from 'ionic-angular';
 
declare var Connection;
 
@Injectable()
export class ConnectivityService {

  connectSubscription: any;
  disconnectSubscription : any;
  onDevice: boolean;
 
  constructor(
    public platform: Platform,
    public events: Events,
  ){
    this.onDevice = this.platform.is('cordova');
    console.log("this.onDevice : " + this.onDevice);
    
    // watch network for a disconnect
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      this.events.publish('connectivity-service-event', "Network was disconnected");
      console.log('network was disconnected :-(');
    });

    // watch network for a connection
    this.connectSubscription = Network.onConnect().subscribe(() => {
      console.log('network connected!'); 
      // We just got a connection but we need to wait briefly
       // before we determine the connection type.  Might need to wait 
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (Network.type === 'wifi') {
          this.events.publish('connectivity-service-event', Network.type + " connected");
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
  }
 
  isOnline(): boolean {
    if(this.onDevice && Network.type){
    	console.log("Network.type : " + Network.type);
      return Network.type !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && Network.type){
      return Network.type === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }

  stopNetworkDisconnectWatch(){
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
  }

  stopNetworkConnectWatch(){
    // stop connect watch
    this.connectSubscription.unsubscribe();
  }


}