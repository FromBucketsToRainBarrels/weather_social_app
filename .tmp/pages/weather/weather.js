var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { UserService } from '../../services/user-service';
import { WeatherService } from '../../providers/weather-service/weather-service';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
export var WeatherPage = (function () {
    function WeatherPage(nav, userService, weatherProvider, alertCtrl, loadingCtrl) {
        this.nav = nav;
        this.userService = userService;
        this.weatherProvider = weatherProvider;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        // get sample data only
        this.stations = [];
        this.search = {
            text: "",
            showCancel: false,
            placeholder: "Search Location",
            filter: "byCity"
        };
        this.stations = this.userService.getUserStations();
    }
    WeatherPage.prototype.onSearchFocus = function (event) {
        console.log("ionFocus : " + event);
    };
    WeatherPage.prototype.onSearchBlur = function (event) {
        //this.search.ngModel ="";
        console.log("onSearchBlur : " + event);
    };
    WeatherPage.prototype.onSearchInput = function (event) {
        console.log("onSearchInput " + event);
    };
    WeatherPage.prototype.queryWeather = function () {
        console.log("queryWeather");
        var me = this;
        this.presentLoading();
        if (this.search.text.length > 0) {
            this.weatherProvider.query(this.search).then(function (response) {
                return response;
            }).then(function (data) {
                me.showRadio(data);
                me.dismissLoading();
            }).catch(function (ex) {
                me.dismissLoading();
                me.presentAlert("No Results", "", null);
            });
        }
        else {
            me.dismissLoading();
        }
    };
    WeatherPage.prototype.getLatestData = function (station, index) {
        console.log("getLatestData : " + station + index);
        var me = this;
        this.presentLoading();
        this.weatherProvider.getWeatherForStation(station).then(function (response) {
            return response;
        }).then(function (data) {
            me.dismissLoading();
        }).catch(function (ex) {
            console.error('Error : ', ex);
            me.dismissLoading();
        });
    };
    WeatherPage.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loader = loader;
        loader.present();
    };
    WeatherPage.prototype.dismissLoading = function () {
        this.loader.dismiss();
    };
    WeatherPage.prototype.showRadio = function (data) {
        var me = this;
        var alert = this.alertCtrl.create();
        alert.setTitle("Confirm");
        alert.addInput({
            type: 'radio',
            label: data.name + "," + data.sys.country,
            value: data,
            checked: true
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: function (data) {
                console.log("ok pressed");
                me.presentLoading();
                me.userService.addStation(data).then(function (response) {
                    return response;
                }).then(function (station) {
                    me.goToSlide(0);
                    me.dismissLoading();
                }).catch(function (ex) {
                    me.dismissLoading();
                    me.presentAlert("Error", ex.message, null);
                });
            }
        });
        alert.present();
    };
    WeatherPage.prototype.goToSlide = function (n) {
        this.slides.slideTo(n, 500);
    };
    WeatherPage.prototype.presentAlert = function (title, message, call) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (call) {
                            call();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    __decorate([
        ViewChild(Slides), 
        __metadata('design:type', Slides)
    ], WeatherPage.prototype, "slides", void 0);
    WeatherPage = __decorate([
        Component({
            selector: 'page-weather',template:/*ion-inline-start:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/weather/weather.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Weather</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="card-background-page">\n\n	<ion-item>\n	    <ion-searchbar\n	      [(ngModel)]="search.text"\n	      [showCancelButton]=\'search.showCancel\'\n	      [placeholder]="search.placeholder"\n	      (ionInput)="onSearchInput($event)"\n	      (ionFocus)="onSearchFocus($event)"\n	      (ionBlur)="onSearchBlur($event)"\n	      (ionCancel)="onSearchCancel($event)"\n	      (search)="queryWeather()">\n	    </ion-searchbar>\n	    <ion-buttons start item-right (click)="queryWeather()">\n	      <button ion-button icon-only>\n	        <ion-icon name="search"></ion-icon>\n	      </button>\n	    </ion-buttons>\n\n	    <!-- <ion-buttons end item-right>\n	      <button ion-button icon-only>\n	        <ion-icon name="md-reorder"></ion-icon>\n	      </button>\n	    </ion-buttons> -->\n	</ion-item>\n  	\n\n    <div *ngIf="stations">\n    	<ion-slides>\n		  <ion-slide *ngFor="let station of stations let i = index" style="background-color: ">\n		    <ion-card>\n			  <ion-card-header>\n			    <div class="card-title">\n			    	{{station.get("name")}}, {{station.get("latestData").get("JSONDataObject")?.sys.country}}<br>\n			    </div>\n			    <div class="card-subtitle">\n			    	{{station.get("latestData").get("JSONDataObject")?.main.temp}} &#8451;<br>\n			    	{{station.get("latestData").get("JSONDataObject")?.weather[0].description}}<br>\n			    	<small>Last Sync : {{station.get("latestData").createdAt}}</small> <ion-icon name="md-sync" item-left (click)="getLatestData(station,i)"></ion-icon>\n			    </div>\n			  </ion-card-header>\n			  <ion-card-content>\n			  	\n			  </ion-card-content>\n			</ion-card>\n		    <ion-card>\n			    <ion-row center>\n				    <ion-col>\n					    <div>\n					    	<ion-icon name="md-home" item-left></ion-icon>\n							<strong>Wind</strong><br>\n		                  	<small>\n		                  		Speed {{station.get("latestData").get("JSONDataObject")?.wind.speed}}<br>\n		                  		Deg {{station.get("latestData").get("JSONDataObject")?.wind.deg}}<br>\n		                  	</small>\n					    </div>\n					</ion-col>\n				    <ion-col>\n					    <div>\n					    	<ion-icon name="ios-water" item-left></ion-icon>\n							<strong>Humidity</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.main.humidity}}<br></small>\n					    </div>\n					</ion-col>\n				    <ion-col>\n					    <div>\n					    	<ion-icon name="md-home" item-left></ion-icon>\n							<strong>Pressure</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.main.pressure}}<br></small>\n					    </div>\n					</ion-col>\n				    <ion-col>\n				      <div>\n				      		<ion-icon name="ios-sunny" item-left></ion-icon>\n							<strong>Sunrise</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.sys.sunrise}}<br></small>\n				      </div>\n				    </ion-col>\n				</ion-row>\n				<ion-row center>\n				    <ion-col>\n					    <div>\n					    	<ion-icon name="ios-thermometer-outline" item-left></ion-icon>\n							<strong>Min Temp</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.main.temp_min}}<br></small>\n					    </div>\n					</ion-col>\n				    <ion-col>\n					    <div>\n					    	<ion-icon name="ios-thermometer-outline" item-left></ion-icon>\n							<strong>Max Temp</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.main.temp_max}}<br></small>\n					    </div>\n					</ion-col>\n				    <ion-col>\n					    <div>\n					    	<ion-icon name="md-home" item-left></ion-icon>\n							<strong>Sea Level</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.main.sea_level}}<br></small>\n					    </div>\n					</ion-col>\n				    <ion-col>\n				      <div>\n				      		<ion-icon name="ios-partly-sunny" item-left></ion-icon>\n							<strong>Sunset</strong><br>\n		                  	<small>{{station.get("latestData").get("JSONDataObject")?.sys.sunset}}<br></small>\n				      </div>\n				    </ion-col>\n				</ion-row>\n			</ion-card>\n		  	<ion-list>\n				  <ion-item>\n				    <h2>Hourly Forecast</h2>\n				    <p>Upto 5 days</p>\n				    <button ion-button clear item-right>View</button>\n				  </ion-item>\n				  <ion-item>\n				    <h2>Daily Forecast</h2>\n				    <p>Upto 16 days</p>\n				    <button ion-button clear item-right>View</button>\n				  </ion-item>\n				</ion-list>\n		  </ion-slide>\n		</ion-slides>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/home/tanzeelrana/Development/school_winter_2017/Final Year Project Files/weather_social_app_v2/src/pages/weather/weather.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, UserService, WeatherService, AlertController, LoadingController])
    ], WeatherPage);
    return WeatherPage;
}());
//# sourceMappingURL=weather.js.map