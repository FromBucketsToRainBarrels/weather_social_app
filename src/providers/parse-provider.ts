import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';
import Parse from 'parse';

import { ConnectivityService } from '../providers/connectivity-service';
import { ErrorHandlerService } from '../providers/error-handler-service';
import { LocalDBService } from '../providers/local-db-service';

/*
  Generated class for the ParseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ParseProvider {

	public current: any;
	public user: any = {userParseObj: null, stations: []};
  public imageCacheService : boolean = false;

  constructor(
    public localDBStorage: LocalDBService,
  	public events: Events,
    public connectivityService: ConnectivityService,
    public errorHandlerService: ErrorHandlerService
  ) {
  	
    events.subscribe("ImgCache.init.success", (val) => {
      this.imageCacheService  = val;
    });

    Parse.initialize('FromBucketsToRainBarrels');
    Parse.serverURL = 'http://162.243.118.87:1337/parse';
    this.current = Parse.User.current();
    if(this.current){
      this.getUser();
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
        me.errorHandlerService.handleError(false, error, me.logout, me, []);
      });
  }

  login(user,pass,context){
  	let me = this;
  		if(me.connectivityService.hasInernet()){
        Parse.User.logIn(user, pass, {
		        success: function(user) {
		          me.user.userParseObj = user;
              me.events.publish("loginSuccess",context);
              me.getUser();
            },
		        error: function(user, error) {
		          me.events.publish("loginFail",context);
              me.errorHandlerService.handleError(false, error, me.login, me, me.getArguments(arguments));
		        }
		    });
  		}else{
        me.events.publish("loginFail",context);
			  me.errorHandlerService.handleError(false, {message:"No internet access"}, me.login, me, me.getArguments(arguments));
  		}
  }

  getUser(){
    let me = this;
    this.localDBStorage.getUser().then((response) => {
      return response;
    }).then((user) => {
      me.user = user;
      if(me.user.userParseObj!=null){
        me.events.publish("getUserEvent", me.user);
      }
      //if internet connection available fetch latest data here
      if(me.connectivityService.hasInernet()){
        me.getUserFomParse();
      }else{
        //no internet connection report to error handler
        me.errorHandlerService.handleError(true,null,me.getUserFomParse,me,[]);
      }
    }).catch((ex) => {
      console.error('Error getting user from localDBStorage: ', ex);
    });
  }

  getUserFomParse(){
    var me = this;
    var userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("objectId", Parse.User.current().id);
    if(me.user.userParseObj){userQuery.notEqualTo("updatedAt"),me.user.userParseObj.updatedAt}
    userQuery.include("stations");
    userQuery.include("defaultStation");
    userQuery.include("defaultStation.latestData");
    userQuery.find({
      success: function(userRetrieved)
      {
        if(userRetrieved[0]){
          me.user.userParseObj = userRetrieved[0];
          var stations = userRetrieved[0].relation("stations");
          var query = stations.query();
          query.notEqualTo("objectId", userRetrieved[0].get("defaultStation").id);
          query.include("latestData");
          query.find({
            success: function(stations) {
              stations.unshift(userRetrieved[0].get("defaultStation"));
              me.user.stations = stations;
              me.events.publish("getUserEvent", me.user);
              me.localDBStorage.saveUser(me.user);
            },
            error: function(stations,error){
              console.error(error);
            }
          });
        }
      },
      error: function(error)
      {
        console.error(error);
      }
    });
  }
  
  getArguments(a){
    return Array.from(a);
  }
}
