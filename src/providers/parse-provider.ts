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
		          me.user.userParseObj = me.getAsJSON(user);
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

  getFeed(){
    let me = this;
    this.localDBStorage.getFeed().then((response) => {
      if(!response){
        response = {posts:[], start:0};
      }
      return response;
    }).then((feed) => {
      me.events.publish("getFeedEvent", feed);
      if(!me.user.userParseObj.saveData){
        me.updateFeed();
      }
    }).catch((ex) => {
      console.error('Error getting feed from localDBStorage: ', ex);
    });
  }

  updateFeed(){
    let me = this;
    if(me.connectivityService.hasInernet()){
      Parse.Cloud.run('updateFeed', { 
        user: me.user.userParseObj 
      }).then(function(feed) {
        feed = JSON.parse(feed);
        me.localDBStorage.saveFeed(feed);
        me.events.publish("updateFeedEvent", feed);
      });
    }else{
      me.errorHandlerService.handleError(false,{message:"No internet access"},"updateFeed","ParseProvider",[]);
    }
  }

  getMoreFeed(n){
    let me = this;
    if(me.connectivityService.hasInernet()){
      Parse.Cloud.run('getMoreFeed', { 
        user: me.user.userParseObj,
        start: n
      }).then(function(posts) {
        posts = JSON.parse(posts);
        me.events.publish("getMoreFeedEvent", posts);
      });
    }else{
      me.events.publish("getMoreFeedEvent", []);
      me.errorHandlerService.handleError(false,{message:"No internet access"},"getMoreFeed","ParseProvider",[]);
    }
  }

  saveFeed(feed){
    let me = this;
    me.localDBStorage.saveFeed(feed);
  }

  likePost(post,index){
    let me = this;
    if(me.connectivityService.hasInernet()){
      Parse.Cloud.run('likePost', { 
        post: post.objectId,
        user: Parse.User.current().id
      }).then(function(post_like_count) {
        console.log("post_like_count : "  + post_like_count);
      });
    }else{
      console.log("error happened");
      me.errorHandlerService.handleError(false,{message:"No internet access"},"likePost","ParseProvider",me.getArguments(arguments));
    }

    // me.likePostTest(post.objectId);

  }

  likePostTest(postId){
    // var postId = request.params.post;
    console.log("postId : " + postId);
    var Post = Parse.Object.extend("Post");
    var post = new Parse.Query(Post);
    post.get(postId, {
      success: function(p) {
        console.log(p);
        var relation = p.relation("likes");
        var query = relation.query();

        query.equalTo("objectId", Parse.User.current().id);
        query.find().then((res) => {
          return res;
        }).then((likes) => {
          console.log("likes : " + likes + " length : " + likes.length);
          if(likes.length){
            console.log("need to remove user from the relation");
            relation.remove(Parse.User.current());
            p.set("likes_count",p.get("likes_count")-1);
          }else{
            console.log("need to add user to the relation");
            relation.add(Parse.User.current());
            p.set("likes_count",p.get("likes_count")+1);
          }
          p.save();
          console.log("p.save() : likes_count : " + p.get("likes_count"));
          // response.success(post.get("likes_count"));
        });
      },
      error: function(post, error) {
        console.log(error);
        // response.error(error);
      }
    });
  }

  getUser(){
    let me = this;
    this.localDBStorage.getUser().then((response) => {
      if(!response){
        let user = me.getAsJSON(Parse.User.current())
        response = {userParseObj: user, stations:[]};
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
            me.user.userParseObj = me.getAsJSON(userRetrieved[0]);
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
      user.set("saveData",me.user.userParseObj.saveData);
      
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

  getAsJSON(user){
    return JSON.parse(JSON.stringify(user));
  }
  
  getArguments(a){
    return Array.from(a);
  }
}
