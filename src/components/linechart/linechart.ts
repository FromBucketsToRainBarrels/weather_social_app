
export class LineChart {

  public jsonData: any;
  public forecastType: any;
  public lineChartReady: boolean = false;
  public lineChartData: any;
  public lineChartLabels: any;
  public lineChartOptions: any;
  public lineChartLegend: any;
  public lineChartType: any;
  public filterKeys: any;
  public weekday: any = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  public charData: any = {
    
    //chart data for 5 day forecast

    temp:{ data: [], label:"Temp"+String.fromCharCode(176)+"C", selected: false },
    sea_level:{ data: [], label:"Sea KhPa", selected: false },
    grnd_level:{ data: [], label:"Ground KhPa", selected: false },
    rain_3h:{ data: [], label:"Rain mm/3h", selected: false },
    snow_3h:{ data: [], label:"Snowmm/3h", selected: false },

    //chart data for 5 day forecast

    temp_day:{ data: [], label:"Day Temp"+String.fromCharCode(176)+"C", selected: false },
    temp_night:{ data: [], label:"Night Temp"+String.fromCharCode(176)+"C", selected: false },
    temp_eve:{ data: [], label:"Eve Temp"+String.fromCharCode(176)+"C", selected: false },
    temp_morn:{ data: [], label:"Morning Temp"+String.fromCharCode(176)+"C", selected: false },

    //chart data common to both forecasts
    temp_min:{ data: [], label:"Min"+String.fromCharCode(176)+"C", selected: false },
    temp_max:{ data: [], label:"Max"+String.fromCharCode(176)+"C", selected: false },
    pressure:{ data: [], label:"AP KhPa", selected: false },
    humidity:{ data: [], label:"Humidity%", selected: false },
    weather_main:{ data: [], label:"weather_main", selected: false },
    weather_description:{ data: [], label:"weather_description", selected: false },
    clouds_all:{ data: [], label:"Cloud%", selected: false },
    wind_speed:{ data: [], label:"Wind Speed m/s", selected: false },
    wind_deg:{ data: [], label:"WindDir "+String.fromCharCode(176), selected: false }
  };

  public constructor(data:any, type:any){
    this.jsonData = data;
    this.forecastType = type;
    this.filterKeys = this.getFilterKeys();
    this.lineChartData = this.getLineChartData();
    this.lineChartLabels =this.getLineChartLabels();
    this.lineChartOptions = {
      responsive: true,
      title: {
        display: false,
        text: 'Custom Chart Title'
      },
      maintainAspectRatio: true
    };
    this.lineChartLegend = true;
    this.lineChartType = 'line';
    this.lineChartReady = true;
  }

  public getLineChartData(){
    if(this.forecastType=='forecast5'){
      return this.getLineChartData5Day();
    }else{
      return this.getLineChartData16Day();
    }
  }

  public getFilterKeys(){
    if(this.forecastType=='forecast5'){
      return this.filterKeys = ["temp","temp_min","temp_max","pressure","sea_level","grnd_level","humidity","weather_main","weather_description","clouds_all","wind_speed","wind_deg","rain_3h","snow_3h"];
    }else{
      return this.filterKeys = this.filterKeys = ["temp_day","temp_night","temp_eve","temp_morn","temp_min","temp_max","pressure","humidity","weather_main","weather_description","clouds_all","wind_speed","wind_deg"];
    }
  }

  public getLineChartData16Day(){
    console.log("getLineChartData16Day() ");
    for(var i=0; i<this.jsonData.list.length; i++){      
      this.charData["temp_day"].data.push(this.jsonData.list[i].temp.day); 
      this.charData["temp_night"].data.push(this.jsonData.list[i].temp.night); 
      this.charData["temp_eve"].data.push(this.jsonData.list[i].temp.eve); 
      this.charData["temp_morn"].data.push(this.jsonData.list[i].temp.morn);
      this.charData["temp_min"].data.push(this.jsonData.list[i].temp.min);
      this.charData["temp_max"].data.push(this.jsonData.list[i].temp.max);
      this.charData["pressure"].data.push(this.jsonData.list[i].pressure/1000);      
      this.charData["humidity"].data.push(this.jsonData.list[i].humidity);
      this.charData["weather_main"].data.push(this.jsonData.list[i].weather.main);
      this.charData["weather_description"].data.push(this.jsonData.list[i].weather.description);
      this.charData["clouds_all"].data.push(this.jsonData.list[i].clouds);
      this.charData["wind_speed"].data.push(this.jsonData.list[i].speed);
      this.charData["wind_deg"].data.push(this.jsonData.list[i].deg);
    }
    //by default return temprature filter
    this.charData["temp_day"].selected = true;
    return [this.charData["temp_day"]];
  }

  public getLineChartData5Day(){
    for(var i=0; i<this.jsonData.list.length; i++){      
      this.charData["temp"].data.push(this.jsonData.list[i].main.temp);
      this.charData["temp_min"].data.push(this.jsonData.list[i].main.temp_min);
      this.charData["temp_max"].data.push(this.jsonData.list[i].main.temp_max);
      this.charData["pressure"].data.push(this.jsonData.list[i].main.pressure/1000);      
      this.charData["sea_level"].data.push(this.jsonData.list[i].main.sea_level/1000);
      this.charData["grnd_level"].data.push(this.jsonData.list[i].main.grnd_level/1000);
      this.charData["humidity"].data.push(this.jsonData.list[i].main.humidity);
      this.charData["weather_main"].data.push(this.jsonData.list[i].weather.main);
      this.charData["weather_description"].data.push(this.jsonData.list[i].weather.description);
      this.charData["clouds_all"].data.push(this.jsonData.list[i].clouds.all);
      this.charData["wind_speed"].data.push(this.jsonData.list[i].wind.speed);
      this.charData["wind_deg"].data.push(this.jsonData.list[i].wind_deg);
      if(this.jsonData.list[i].rain){
        this.charData["rain_3h"].data.push(this.jsonData.list[i].rain["3h"]);
      }
      if(this.jsonData.list[i].snow){
        this.charData["snow_3h"].data.push(this.jsonData.list[i].snow["3h"]);
      }    
    }

    //by default return temprature filter
    this.charData["temp"].selected = true;
    return [this.charData["temp"]];
  }

  public getLineChartLabels(){
    var labels = [];
    for(var i=0; i<this.jsonData.list.length; i++){
      var time = new Date(this.jsonData.list[i].dt*1000);
      if(this.forecastType=='forecast5'){
        var hours = time.getHours();
        var ampm = hours >= 12 ? 'pm' : 'am';
        var str = "" + ((hours%12)) + ampm;
        labels.push(str);
      }else{
        labels.push(this.weekday[time.getDay()]);
      }
      
    }
    return labels;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public updateFilters(filters){
    console.log("update filters : " + filters);
    let _lineChartData:Array<any> = new Array();
    this.resetFilters();
    for (let i = 0; i < filters.length; i++) {
      this.charData[filters[i]].selected = true;
      _lineChartData[i] = this.charData[filters[i]];
    }
    this.lineChartData = _lineChartData;
  }

  public resetFilters(){
    for (var key in this.charData) {
      this.charData[key].selected = false;
    }
  }

}
