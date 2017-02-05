import {Injectable} from "@angular/core";
import {Events} from 'ionic-angular';
import {WeatherService} from '../providers/weather-service/weather-service';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import Parse from 'parse';

@Injectable()
export class UserService {

  private user: any;
  private find: any;

  constructor(
    public events: Events,
    public weatherService: WeatherService,
    public http: Http
  ) {
    this.user = {
      stations: []
    };
    events.subscribe('userFetch:complete', user => {
      this.user = {
        userParseObj: user[0],
        stations: []
      };
      this.getFullUser();
    });
  }

  addStation(data){
    var me = this;
    return new Promise((resolve, reject) => {
      me.weatherService.addStation(data).then((response) => {
        return response;
      }).then((station) => {
        var user = me.user.userParseObj;
        me.find = station;
        var indx = me.user.stations.findIndex(function(x) { return x.id == me.find.id; });
        if(indx!=-1)me.user.stations.splice(indx, 1);
        me.user.stations.unshift(station);
        var stations = user.relation("stations");
        stations.add(station);
        user.set("defaultStation", station);
        user.save(null, {
          success: function(user){
            resolve(station);
          },error: function(user,error){
            reject(error);
          }
        })
      }).catch((ex) => {
        reject(ex);
      });
    });
  }

  getFullUser(){
    var me = this;
    var userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("objectId", Parse.User.current().id);
    userQuery.include("stations");
    userQuery.include("defaultStation");
    userQuery.include("defaultStation.latestData");
    return new Promise((resolve, reject) => {
      userQuery.find({
        success: function(userRetrieved)
        {
          me.user.userParseObj = userRetrieved[0];
          var stations = userRetrieved[0].relation("stations");
          var query = stations.query();
          query.notEqualTo("objectId", userRetrieved[0].get("defaultStation").id);
          query.include("latestData");
          query.find({
            success: function(stations) {
              stations.unshift(userRetrieved[0].get("defaultStation"));
              me.user.stations = stations;
              resolve(me.user);
            }
          });
        },
        error: function(error)
        {
          reject(error);
        }
      });
    })
  }

  getUser(){
    return this.user.userParseObj;
  }

  getUserStations(){
    return this.user.stations;
  }

  getUserInfo(){

    var info={
      timeOpened:new Date(),
      timezone:(new Date()).getTimezoneOffset()/60,
      pageon : window.location.pathname,
      referrer :  document.referrer,
      previousSites :  history.length,
      browserName : navigator.appName,
      browserEngine : navigator.product,
      browserVersion1a : navigator.appVersion,
      browserVersion1b : navigator.userAgent,
      browserLanguage: navigator.language,
      browserOnline : navigator.onLine,
      browserPlatform : navigator.platform,
      javaEnabled : navigator.javaEnabled(),
      dataCookiesEnabled : navigator.cookieEnabled,
      dataCookies1 : document.cookie,
      dataStorage : localStorage,
      sizeScreenW : screen.width,
      sizeScreenH : screen.height,
      sizeInW : innerWidth,
      sizeInH : innerHeight,
      sizeAvailW : screen.availWidth,
      sizeAvailH : screen.availHeight,
      scrColorDepth : screen.colorDepth,
      scrPixelDepth : screen.pixelDepth,
    };

    return new Promise((resolve, reject) => {
      var me = this;
      var url = 'http://ip-api.com/json';
      me.http.get(url).map(res => res.json())
        .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            var Analytics = Parse.Object.extend("Analytics");
            var analytics = new Analytics();
            analytics.set("user",Parse.User.current());
            analytics.set("deviceInfo",info);
            analytics.set("ipInfo",data);
            analytics.save(null, {
              success: function(analytics){
                resolve(null);
              },
              error: function(analytics,error){
                reject(error);
              }
            });
          },
          err => {
            reject(err);
          });
    });
  }

}
