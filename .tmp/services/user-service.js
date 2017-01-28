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
import Parse from 'parse';
export var UserService = (function () {
    function UserService(events, weatherService) {
        var _this = this;
        this.events = events;
        this.weatherService = weatherService;
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
    UserService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Events, WeatherService])
    ], UserService);
    return UserService;
}());
//# sourceMappingURL=user-service.js.map