import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { ParseProvider } from '../providers/parse-provider';
import { ConnectivityService } from '../providers/connectivity-service';
import { LocalDBService } from '../providers/local-db-service';

/*
  Generated class for the SyncService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SyncService {

  constructor(
    public connectivityService: ConnectivityService,
    public localDBStorage: LocalDBService,
  	public events: Events,
  ) {
  	console.log("SyncService init");
    this.subscribeToConnectivityService();
  }

  subscribeToConnectivityService(){
  	console.log("subscribeToConnectivityService");
  	let me = this;
  	me.events.subscribe("connectivity-service-event:internet", (val) => {
      console.log("connectivity-service-event:internet : " + val);
      if(val){
      	me.completeJobsInQueue();
      }
    });
  }

  addToJobsQueue(job){
  	console.log("addToJobsQueue");
  	let me = this;
  	me.localDBStorage.getJobsQueue().then((response) => {
  	  if(response==null){
        console.log("response = {}");
        response = {}
      }
      return response;
    }).then((jobsQueue) => {
      jobsQueue[job.id] = job;
      me.localDBStorage.saveJobsQueue(jobsQueue);
    }).catch((ex) => {
      console.error('Error getting jobsQueue from localDBStorage: ', ex);
      let jobsQueue = {};
      jobsQueue[job.id] = job;
      me.localDBStorage.saveJobsQueue(jobsQueue);
    });	
  }

  completeJobsInQueue(){
  	console.log("completeJobsInQueue");
  	let me = this;
  	me.localDBStorage.getJobsQueue().then((response) => {
  		if(response==null){
        console.log("response = {}");
        response = {}
      }
      	return response;
  	}).then((jobsQueue) => {
  		//clean the jobs queue first
  		me.createEmptyJobsQueue();
  		for (var key in jobsQueue) {
  			me.executeJob(jobsQueue[key]);
  		}
  	}).catch((ex) => {
  		console.error('Error getting jobsQueue from localDBStorage: ', ex);
  		me.createEmptyJobsQueue();
  	});
  }

  executeJob(job){
    this.events.publish("syncServiceExecuteJob", job);
  	
  }

  createEmptyJobsQueue(){
  	console.log("createEmptyJobsQueue");
  	let jobsQueue = {};
  	this.localDBStorage.saveJobsQueue(jobsQueue);
  }
}
