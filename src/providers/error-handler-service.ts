import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import {Storage} from '@ionic/storage';
import { Platform, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ConnectivityService } from '../providers/connectivity-service';

/*
  Generated class for the ErrorHandlerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ErrorHandlerService {

  constructor(
  	public http: Http,
  	public storage: Storage,
  	public events: Events,
    public connectivityService: ConnectivityService
  ) {
    
  }

  // {error:error, function:function, context:context, args: args}
  handleError(obj){
    console.log(obj);
    if(obj.error){
      this.events.publish('error-handler-service-event', obj.error.message);
    }
    this.connectivityService.testInternetAccess();    
    if(obj.retry){
      setTimeout(function(obj){
        var login = wrapFunction(obj.function, obj.context, obj.args);
        (login)();
      }, 5000, obj);
    }
  }

  wrapFunction(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
  }

}

var wrapFunction = function(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
}