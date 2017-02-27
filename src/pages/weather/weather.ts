import {Component} from '@angular/core';
import {NavController, Slides, Events} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {ParseProvider} from '../../providers/parse-provider';
import {WeatherService} from '../../providers/weather-service';
import {LoadingService} from "../../services/loading-service";
import {ForecastPage} from '../forecast/forecast';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
	@ViewChild(Slides) slides: Slides;
  
  public search: any;
	public stations: any;
	public loader: any;
	public find: any;

  //page event handlers
  private getStationsEvent: (stations) => void;

  constructor(
    public nav: NavController,
  	public weatherProvider: WeatherService,
  	public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public parseProvider: ParseProvider,
    public events: Events,
  ) {
    this.stations=[];
    this.search = {
    	text:"",
    	showCancel:false,
    	placeholder:"Search Location",
    	filter: "byCity"
    };
    this.stations = this.parseProvider.user.stations;
  }

  ionViewWillEnter(){
    this.initializeEventHandlers();
    this.subscribeEventHandlers();
  }

  ionViewWillLeave() {
    this.unsubscribeEventHandlers();
  }

  initializeEventHandlers(){
    this.initializeGetStationsEventHandler();
  }

  subscribeEventHandlers(){
    this.events.subscribe('getUserStationsEvent', this.getStationsEvent);
  }

  unsubscribeEventHandlers(){
    this.unsubscribeGetStationsEventHandler();
  }

  initializeGetStationsEventHandler(){
    let me = this;
    this.getStationsEvent = (stations) => {
      me.stations = stations;
    };
  }

  unsubscribeGetStationsEventHandler(){
    if(this.getStationsEvent){
      this.events.unsubscribe('getUserStationsEvent', this.getStationsEvent);
      this.getStationsEvent = undefined;
    }
  }

  goToForecastPage(station,forecastType){
    this.nav.push(ForecastPage, { station: station, forecastType: forecastType });
  }

  showDetails(index){
    let me = this;
    (!me.stations[index].showDetails) ? me.stations[index].showDetails=true : me.stations[index].showDetails=false;
  }

  onSearchFocus(event){
    console.log("ionFocus : " + event);

  }

  onSearchBlur(event){
    //this.search.ngModel ="";
    console.log("onSearchBlur : "+ event);

  }

  onSearchInput(event){
    console.log("onSearchInput " + event);

  }

  queryWeather(){
  	console.log("queryWeather");
  	var me = this;
  	this.presentLoading();
  	if(this.search.text.length > 0){
  		this.weatherProvider.query(this.search).then((response) => {
	      return response;
	    }).then((data) => {
		  me.showRadio(data);
	      me.dismissLoading();
	    }).catch((ex) => {
	      me.dismissLoading();
	      me.presentAlert("No Results","",null);
	    });
  	}else{
  		me.dismissLoading();
  	}
  }

  getLatestData(station, index){
  	console.log("getLatestData : " + station + index);
  	var me = this;
  	this.presentLoading();
  	this.weatherProvider.getWeatherForStation(station).then((response) => {
      return response;
    }).then((data) => {
      me.dismissLoading();
    }).catch((ex) => {
      console.error('Error : ', ex);
      me.dismissLoading();
    });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader = loader;
    loader.present();
  }

  dismissLoading(){
    this.loader.dismiss().catch(() => {});
  }

  showRadio(data) {
  	var me = this;
    let alert = this.alertCtrl.create();
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
      handler: data => {
  		console.log("ok pressed");
  		me.presentLoading();
    	me.parseProvider.addStation(data).then((response) => {
     		return response;
	    }).then((station) => {
	    	me.goToSlide(0);
	      	me.dismissLoading();
	    }).catch((ex) => {
	      	me.dismissLoading();
	      	me.presentAlert("Error",ex.message,null);
	    });
      }
    });
    alert.present();
  }

  goToSlide(n) {
    this.slides.slideTo(n, 500);
  }

  presentAlert(title,message,call) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if(call){
              call();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
