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

    events.subscribe("syncServiceExecuteJob", (val) =>{
      let me = this;
      me.syncEventExecuter(val);
    });

    Parse.initialize('FromBucketsToRainBarrels');
    Parse.serverURL = 'http://162.243.118.87:1337/parse';
    this.current = Parse.User.current();
    if(this.current){
      this.getUser();
  	}
  }

  syncEventExecuter(val){
    console.log("syncServiceExecuteJob");
    console.log(val);
    if(this.constructor.name == val.context){
      this[val.function](val.args);
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
        me.errorHandlerService.handleError(false, error, "logout", "ParseProvider", []);
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
              me.errorHandlerService.handleError(false, error, "login", "ParseProvider", me.getArguments(arguments));
		        }
		    });
  		}else{
        me.events.publish("loginFail",context);
			  me.errorHandlerService.handleError(false, {message:"No internet access"}, "login", "ParseProvider", me.getArguments(arguments));
  		}
  }

  getUser(){
    let me = this;
    this.localDBStorage.getUser().then((response) => {
      if(!response){
        response = {userParseObj: Parse.User.current(), stations:[]};
      }
      return response;
    }).then((user) => {
      me.user = user;
      if(me.user.userParseObj!=null){
        me.events.publish("getUserEvent", me.user);
      }
      me.getUserFomParse();
    }).catch((ex) => {
      me.getUserFomParse();
      console.error('Error getting user from localDBStorage: ', ex);
    });
  }

  getUserFomParse(){
    var me = this;
    if(me.connectivityService.hasInernet()){
      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("objectId", Parse.User.current().id);
      // if(me.user.userParseObj){userQuery.notEqualTo("updatedAt"),me.user.userParseObj.updatedAt}
      userQuery.include("stations");
      userQuery.include("defaultStation");
      userQuery.include("defaultStation.latestData");
      userQuery.find({
        success: function(userRetrieved)
        {
          if(userRetrieved[0]){
            me.user.userParseObj = me.getUserAsJSON(userRetrieved[0]);
            me.events.publish("getUserEvent", me.user);
            me.localDBStorage.saveUser(me.user);
          }
        },
        error: function(error)
        {
          console.error(error);
        }
      });
    }else{
      me.errorHandlerService.handleError(false,null,"getUserFomParse","ParseProvider",[]);
    }
  }

  //will get all stations that user follows with the default one at index 0
  //results stored in this.user.stations array
  getUserStations(){
    let me = this;
    let user = Parse.User.current();
    if(me.connectivityService.hasInernet()){
      let stations = user.relation("stations");
      let query = stations.query();
      query.notEqualTo("objectId", user.get("defaultStation").id);
      query.include("latestData");
      query.find({
        success: function(stations) {
          stations.unshift(user.get("defaultStation"));
          me.user.stations = stations;
          me.events.publish("getUserStationsEvent", me.user.stations);
          me.localDBStorage.saveUser(me.user);
        },
        error: function(stations,error){
          console.error(error);
        }
      });
    }else{
      me.errorHandlerService.handleError(true,null,"getUserStations","ParseProvider",me.getArguments(arguments));
    }
  }

  saveUser(){
    let me = this;
    me.localDBStorage.saveUser(me.user);
    if(me.connectivityService.hasInernet()){
      
      let user = Parse.User.current();
      user.set("name",me.user.userParseObj.name);
      user.set("phone",me.user.userParseObj.phone);
      user.set("email",me.user.userParseObj.email);
      
      if(me.user.userParseObj.image.upload){
        user.set("image",me.user.userParseObj.image.parseImageFile);
      }
      user.save(null,{
        success: function(user){
          console.log("UpdateComplete");
          console.log(me.user);
          me.user.userParseObj.image.url = user.get("image").url();
          me.localDBStorage.saveUser(me.user);
        },
        error: function(user,error){
          me.errorHandlerService.handleError(false,error,"saveUser","ParseProvider",me.getArguments(arguments));
        }
      });
    }else{
      me.errorHandlerService.handleError(true,null,"saveUser","ParseProvider",[]);
    }
  }

  // name : String,  encoding : base64-encoded 
  getParseFile(name, encoding){
    name = name.replace(/[^a-zA-Z0-9_.]/g, '');
    let parseFile = new Parse.File( name, encoding);
    return parseFile;
  }

  getParseUserFromJSON(){

  }

  getUserAsJSON(user){
    return JSON.parse(JSON.stringify(user));
  }
  
  getArguments(a){
    return Array.from(a);
  }
}
