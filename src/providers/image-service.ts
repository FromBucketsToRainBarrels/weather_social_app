import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ParseProvider } from './parse-provider';

/*
  Generated class for the ImageUploadService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImageService {

  constructor(
  	public http: Http,
  	public parse: ParseProvider
  ) {
    console.log('Hello ImageUploadService Provider');
  }

  getImage(fileInput){
  	if (fileInput.target.files && fileInput.target.files[0]) {
	  let me = this;
	  let reader = new FileReader();
	  let img = {};
	  return new Promise((resolve, reject) => { 
	  	reader.onload = function (e : any) {
		      if(e.target.result){
		      	img['url'] = e.target.result;
		      	img['upload'] = true;
		      	img['parseImageFile'] = me.parse.getParseFile(fileInput.target.files[0].name, { base64: e.target.result });
		      	resolve(img);
		      }else{
		      	img['upload'] = false;
		      	reject(img);
		      }
		  }
		  reader.readAsDataURL(fileInput.target.files[0]);
	  });
	}
  }

}
