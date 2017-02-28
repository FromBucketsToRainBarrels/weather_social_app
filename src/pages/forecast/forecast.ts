import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController,NavParams,AlertController,LoadingController,ModalController,Events} from 'ionic-angular';
import {LineChart} from '../../components/linechart/linechart';
import {WeatherService} from '../../providers/weather-service';
import { Chart } from 'chart.js';

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
  public hideChart: boolean = true;
  // public chart: LineChart;

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;

  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl:ModalController,
    public events: Events,
    public params: NavParams,
    public cdr: ChangeDetectorRef,
    public weatherProvider: WeatherService
  ) {
    let me = this;
    this.station = params.data.station;
    this.forecastType = params.data.forecastType;

    this.presentLoading();
    weatherProvider.getForecastForStation(this.station,this.forecastType).then((response) => {
      return response;
    }).then((forecastData) => {
      me.forecastData = forecastData;
      let rawChartData = new LineChart(forecastData,me.forecastType);
      console.log(rawChartData);
      me.setChart(rawChartData);
      me.fixIframe();
    }).catch((ex) => {
      console.error('Error : ', ex);
      me.dismissLoading();
    });
  }

  fixIframe(){
    var x = <HTMLElement>document.getElementsByClassName("chartjs-hidden-iframe")[0];
    x.style.display = "none";
  }

  setChart(rawChartData){
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: rawChartData.lineChartLabels,
          datasets: rawChartData.lineChartData
        }
    });
    this.lineChart["rawChartData"] = rawChartData;
    this.hideChart = false;
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
    let rawChartData = me.lineChart["rawChartData"];
    alert.setTitle('Filter weather data');
    
    for(var i=0; i<rawChartData.filterKeys.length; i++){
      alert.addInput({
        type: 'checkbox',
        label: rawChartData.charData[rawChartData.filterKeys[i]].label,
        value: rawChartData.filterKeys[i],
        checked: rawChartData.charData[rawChartData.filterKeys[i]].selected
      });
    }
    
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        if(data.length==0){
          me.presentAlert("Error","No filter selected.",null);
        }else{
          rawChartData.updateFilters(data);
          me.setChart(rawChartData);
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