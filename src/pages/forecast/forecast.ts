import {Component} from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ModalController,
  Events
} from 'ionic-angular';
import {LineChart} from '../../components/linechart/linechart';
import {WeatherService} from '../../providers/weather-service/weather-service';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html'
})
export class ForecastPage {
  // slides for slider

  public loader: any;
  public station: any;
  public forecastType: any;
  public forecastData: any;
  public chart: LineChart;
  public weekday: any = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl:ModalController,
    public events: Events,
    public params: NavParams,
    public weatherProvider: WeatherService
  ) {
    let me = this;
    this.station = params.data.station;
    this.forecastType = params.data.forecastType;

    events.subscribe('comment_post_complete', comment => {
      console.log("Event : comment_post_complete");
    });

    this.presentLoading();
    weatherProvider.getForecastForStation(this.station,this.forecastType).then((response) => {
      return response;
    }).then((forecastData) => {
      me.forecastData = forecastData;
      me.chart = new LineChart(forecastData,me.forecastType);
    }).catch((ex) => {
      console.error('Error : ', ex);
      me.dismissLoading();
    });
  }

  showChart(chart){
    chart.lineChartReady = true;
  }

  addData(chart){
    chart.addData();
    this.chart = chart;
    console.log(this.chart);
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

  showCheckbox() {
    let alert = this.alertCtrl.create();
    let me = this;
    alert.setTitle('Filter weather data');
    console.log("showCheckbox");
    for(var i=0; i<me.chart.filterKeys.length; i++){
      alert.addInput({
        type: 'checkbox',
        label: me.chart.charData[me.chart.filterKeys[i]].label,
        value: me.chart.filterKeys[i],
        checked: me.chart.charData[me.chart.filterKeys[i]].selected
      });
    }
    
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        if(data.length==0){
          me.presentAlert("Error","No filter selected.",null);
        }else{
          me.chart.updateFilters(data);
        }
      }
    });
    alert.present();
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