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
    console.log('Hello ErrorHandlerService Provider');
  }

  handleError(error){
  	this.events.publish('error-handler-service-event', error.message);
  }

}
