import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import { Http } from '@angular/http';
import Parse from 'parse';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocalDBService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocalDBService {

  constructor(
  	public http: Http,
  	public storage: Storage,
  ) {
    console.log('Init LocalDBService Provider');
  }

  getUser(){
  	let me = this;
  	return new Promise((resolve, reject) => {
  		me.storage.get('user').then((user) => {
	      resolve(user);
	    });
  	});
  }

  saveUser(user){
  	let me = this;
  	me.storage.set('user', me.seriallize(user));
  }

  getJobsQueue(){
    let me = this;
    return new Promise((resolve, reject) => {
      me.storage.get('jobsQueue').then((jobsQueue) => {
        resolve(jobsQueue);
      });
    });
  }

  saveJobsQueue(jobsQueue){
    let me = this;
    me.storage.set('jobsQueue', jobsQueue);
  }

  seriallize(obj){
  	return JSON.parse(JSON.stringify(obj));
  }

  //do not deseriallizeUser
  deseriallizeUser(user){
    let me = this;
    let retObj = {userParseObj: null, stations:[]};  
    
    if(user){
    	
    	//deseriallize user
    	if(Parse.User.current()){user.userParseObj.sessionToken = Parse.User.current().getSessionToken()}
		  user.userParseObj.className = "_User" 
	    retObj.userParseObj = Parse.Object.fromJSON(user.userParseObj);
	    
	    //deseriallize user stations array one by one
	    let stations = [];
	    for(var i=0;i<user.stations.length; i++){
	      user.stations[i].className = "WeatherStation";
	      retObj.stations.push(Parse.Object.fromJSON(user.stations[i]));
	    }
    }
    console.log("LocalDBService : deseriallizeUser() : " + JSON.stringify(retObj));
    return retObj;
  }
}
