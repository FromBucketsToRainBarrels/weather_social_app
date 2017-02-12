import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';
import Parse from 'parse';

import { ConnectivityService } from '../providers/connectivity-service';
import { ErrorHandlerService } from '../providers/error-handler-service';

/*
  Generated class for the ParseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ParseProvider {

	public current: any;
	public fullUser: any = null;
	public stations: any = [];

  constructor(
  	public storage: Storage,
  	public events: Events,
    public connectivityService: ConnectivityService,
    public errorHandlerService: ErrorHandlerService
  ) {
  	Parse.initialize('FromBucketsToRainBarrels');
    Parse.serverURL = 'http://162.243.118.87:1337/parse';
  	this.current = Parse.User.current()
  	if(Parse.User.current()){

  	}
  }

  getCurrentUser(){
  	return this.current;
  }

  logout(){
  	let me = this;
  	me.current = null;
	  
    Parse.User.logOut().then(
      function(user){

      },function(error){
      	console.error(error);
        me.errorHandlerService.handleError(error);
      });
  }

  login(user,pass){
  	let me = this;
  	return new Promise((resolve, reject) => {
  		if(me.connectivityService.hasInernet()){
  			Parse.User.logIn(user, pass, {
		        success: function(user) {
		          console.log(user);
		          resolve(user);
		        },
		        error: function(user, error) {
		          me.errorHandlerService.handleError(error);
		          reject(error);
		        }
		    });
  		}else{
  			let error = {message: "No internet connection"}
			  me.errorHandlerService.handleError(error);
  			reject(error);
  		}
	  		
  	});
  }

  deseriallizeUser(user){
  	if(user){
  		user.className = "_User";
  		user = Parse.Object.fromJSON(user);
  	}
  	return user;
  }

  

}
