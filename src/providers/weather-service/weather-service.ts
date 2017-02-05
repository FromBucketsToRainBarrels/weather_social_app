import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import Parse from 'parse';

@Injectable()
export class WeatherService {

  public data: any;

  constructor(
    public http: Http
  ) {
    this.data = {};
  }

  query(searchObject){
    return new Promise((resolve, reject) => {
      var me = this;
      var url = 'http://api.openweathermap.org/data/2.5/weather?q='+searchObject.text+'&appid=a2cd6d38297c74aacd283ff499d3441e';
      this.http.get(url).map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          console.log("q="+searchObject.text + " result : " + data.name);
          resolve(data);
        },
        err => {
            reject(err);
        });
    });
  }



  getWeatherForStation(station) {

    // if (this.data[station.id]) {
    //   // already loaded data
    //   return Promise.resolve(this.data);
    // }

    // don't have the data yet
    return new Promise((resolve, reject) => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      var me = this;
      var url = 'http://api.openweathermap.org/data/2.5/weather?id='+station.get("station_external_id")+'&appid=a2cd6d38297c74aacd283ff499d3441e';
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data[station.get("station_external_id")] = data;

          var weatherData = {JSONDataObject : data};
          me.saveLatestWeatherDataForStation(weatherData,station).then((response) => {
            return response;
          }).then((response) => {
            resolve(response);
          }).catch((ex) => {
            reject(ex);
          });
        },
        err => {
            reject(err);
        });
    });
  }

  addStation(data){
    var me = this;
    return new Promise((resolve, reject) => {
      var weatherStationQuery = new Parse.Query("WeatherStation");
      weatherStationQuery.equalTo("station_external_id",data.id);
      weatherStationQuery.include("latestData");
      weatherStationQuery.find(
      {
          success: function(station){
            if(station.length==0){
              var WeatherStation = Parse.Object.extend("WeatherStation");
              var weatherStation = new WeatherStation();
              weatherStation.set("coord", data.coord);
              weatherStation.set("country", data.sys.country);
              weatherStation.set("name", data.name);
              weatherStation.set("station_external_id", data.id);
              weatherStation.save(null, {
                success: function(station){
                  var weatherData = {JSONDataObject : data};
                  me.saveLatestWeatherDataForStation(weatherData,station).then((response) => {
                    resolve(response);
                  }).catch((ex) => {
                    reject(ex);
                  });
                },
                error: function(weatherData,error){
                  reject(error);
                }
              });
            }else{
              resolve(station[0]);
            }
          },error: function(station,error){
            reject(error);
          }
      })
    });
  }

  saveLatestWeatherDataForStation(data,station){
    var WeatherData = Parse.Object.extend("WeatherData");
    var weatherData = new WeatherData();

    if(data.JSONDataObject){
      weatherData.set("JSONDataObject", data.JSONDataObject);
    }

    return new Promise((resolve, reject) => {
      weatherData.save(null, {
        success: function(weatherData){
          var data = station.relation("data");
          station.set("latestData",weatherData);
          data.add(weatherData);
          station.save(null, {
            success: function (staion){
              resolve(staion);
            },
            error: function(staion,error){
              reject(error);
            }
          })
        },
        error: function(weatherData,error){
          reject(error);
        }
      });
    });
  }
}

