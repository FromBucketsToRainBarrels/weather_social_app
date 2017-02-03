var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import Parse from 'parse';
export var WeatherService = (function () {
    function WeatherService(http) {
        this.http = http;
        this.data = {};
    }
    WeatherService.prototype.query = function (searchObject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var me = _this;
            var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + searchObject.text + '&appid=a2cd6d38297c74aacd283ff499d3441e';
            _this.http.get(url).map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log("q=" + searchObject.text + " result : " + data.name);
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    WeatherService.prototype.getWeatherForStation = function (station) {
        // if (this.data[station.id]) {
        //   // already loaded data
        //   return Promise.resolve(this.data);
        // }
        var _this = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            var me = _this;
            var url = 'http://api.openweathermap.org/data/2.5/weather?id=' + station.get("station_external_id") + '&appid=a2cd6d38297c74aacd283ff499d3441e';
            _this.http.get(url)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                _this.data[station.get("station_external_id")] = data;
                var weatherData = { JSONDataObject: data };
                me.saveLatestWeatherDataForStation(weatherData, station).then(function (response) {
                    return response;
                }).then(function (response) {
                    resolve(response);
                }).catch(function (ex) {
                    reject(ex);
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    WeatherService.prototype.addStation = function (data) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var weatherStationQuery = new Parse.Query("WeatherStation");
            weatherStationQuery.equalTo("station_external_id", data.id);
            weatherStationQuery.include("latestData");
            weatherStationQuery.find({
                success: function (station) {
                    if (station.length == 0) {
                        var WeatherStation = Parse.Object.extend("WeatherStation");
                        var WeatherStation = new WeatherStation();
                        WeatherStation.set("coord", data.coord);
                        WeatherStation.set("country", data.sys.country);
                        WeatherStation.set("name", data.name);
                        WeatherStation.set("station_external_id", data.id);
                        WeatherStation.save(null, {
                            success: function (station) {
                                var weatherData = { JSONDataObject: data };
                                me.saveLatestWeatherDataForStation(weatherData, station).then(function (response) {
                                    resolve(response);
                                }).catch(function (ex) {
                                    reject(ex);
                                });
                            },
                            error: function (weatherData, error) {
                                reject(error);
                            }
                        });
                    }
                    else {
                        resolve(station[0]);
                    }
                }, error: function (station, error) {
                    reject(error);
                }
            });
        });
    };
    WeatherService.prototype.saveLatestWeatherDataForStation = function (data, station) {
        var WeatherData = Parse.Object.extend("WeatherData");
        var weatherData = new WeatherData();
        if (data.JSONDataObject) {
            weatherData.set("JSONDataObject", data.JSONDataObject);
        }
        return new Promise(function (resolve, reject) {
            weatherData.save(null, {
                success: function (weatherData) {
                    var data = station.relation("data");
                    station.set("latestData", weatherData);
                    data.add(weatherData);
                    station.save(null, {
                        success: function (staion) {
                            resolve(staion);
                        },
                        error: function (staion, error) {
                            reject(error);
                        }
                    });
                },
                error: function (weatherData, error) {
                    reject(error);
                }
            });
        });
    };
    WeatherService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], WeatherService);
    return WeatherService;
}());
//# sourceMappingURL=weather-service.js.map