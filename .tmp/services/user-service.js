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
import { Events } from 'ionic-angular';
import { WeatherService } from '../providers/weather-service/weather-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import Parse from 'parse';
export var UserService = (function () {
    function UserService(events, weatherService, http) {
        var _this = this;
        this.events = events;
        this.weatherService = weatherService;
        this.http = http;
        this.user = {
            stations: []
        };
        events.subscribe('userFetch:complete', function (user) {
            _this.user = {
                userParseObj: user[0],
                stations: []
            };
            _this.getFullUser();
        });
    }
    UserService.prototype.addStation = function (data) {
        var me = this;
        return new Promise(function (resolve, reject) {
            me.weatherService.addStation(data).then(function (response) {
                return response;
            }).then(function (station) {
                var user = me.user.userParseObj;
                me.find = station;
                var indx = me.user.stations.findIndex(function (x) { return x.id == me.find.id; });
                if (indx != -1)
                    me.user.stations.splice(indx, 1);
                me.user.stations.unshift(station);
                var stations = user.relation("stations");
                stations.add(station);
                user.set("defaultStation", station);
                user.save(null, {
                    success: function (user) {
                        resolve(station);
                    }, error: function (user, error) {
                        reject(error);
                    }
                });
            }).catch(function (ex) {
                reject(ex);
            });
        });
    };
    UserService.prototype.getFullUser = function () {
        var me = this;
        var userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("objectId", Parse.User.current().id);
        userQuery.include("stations");
        userQuery.include("defaultStation");
        userQuery.include("defaultStation.latestData");
        return new Promise(function (resolve, reject) {
            userQuery.find({
                success: function (userRetrieved) {
                    console.log("userRetrieved : " + userRetrieved);
                    me.user.userParseObj = userRetrieved[0];
                    var stations = userRetrieved[0].relation("stations");
                    var query = stations.query();
                    query.notEqualTo("objectId", userRetrieved[0].get("defaultStation").id);
                    query.include("latestData");
                    query.find({
                        success: function (stations) {
                            console.log(stations);
                            stations.unshift(userRetrieved[0].get("defaultStation"));
                            me.user.stations = stations;
                            resolve(me.user);
                        }
                    });
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    };
    UserService.prototype.getUser = function () {
        return this.user.userParseObj;
    };
    UserService.prototype.getUserStations = function () {
        return this.user.stations;
    };
    UserService.prototype.getUserInfo = function () {
        var _this = this;
        var info = {
            timeOpened: new Date(),
            timezone: (new Date()).getTimezoneOffset() / 60,
            pageon: window.location.pathname,
            referrer: document.referrer,
            previousSites: history.length,
            browserName: navigator.appName,
            browserEngine: navigator.product,
            browserVersion1a: navigator.appVersion,
            browserVersion1b: navigator.userAgent,
            browserLanguage: navigator.language,
            browserOnline: navigator.onLine,
            browserPlatform: navigator.platform,
            javaEnabled: navigator.javaEnabled(),
            dataCookiesEnabled: navigator.cookieEnabled,
            dataCookies1: document.cookie,
            dataStorage: localStorage,
            sizeScreenW: screen.width,
            sizeScreenH: screen.height,
            sizeInW: innerWidth,
            sizeInH: innerHeight,
            sizeAvailW: screen.availWidth,
            sizeAvailH: screen.availHeight,
            scrColorDepth: screen.colorDepth,
            scrPixelDepth: screen.pixelDepth,
        };
        return new Promise(function (resolve, reject) {
            var me = _this;
            var url = 'http://ip-api.com/json';
            me.http.get(url).map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                var Analytics = Parse.Object.extend("Analytics");
                var analytics = new Analytics();
                analytics.set("user", Parse.User.current());
                analytics.set("deviceInfo", info);
                analytics.set("ipInfo", data);
                analytics.save(null, {
                    success: function (analytics) {
                        resolve(null);
                    },
                    error: function (analytics, error) {
                        reject(error);
                    }
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    UserService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof Events !== 'undefined' && Events) === 'function' && _a) || Object, (typeof (_b = typeof WeatherService !== 'undefined' && WeatherService) === 'function' && _b) || Object, (typeof (_c = typeof Http !== 'undefined' && Http) === 'function' && _c) || Object])
    ], UserService);
    return UserService;
    var _a, _b, _c;
}());
//# sourceMappingURL=user-service.js.map