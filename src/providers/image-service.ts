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
    // console.log('Hello ImageUploadService Provider');
  }

  getImage(fileInput){
	let me = this;
	let reader = new FileReader();
	let img = {upload:false};
	return new Promise((resolve, reject) => { 
	  	if (fileInput.target.files.length == 1) {
		  	reader.onload = function (e : any) {
			      if(e.target.result){
			      	img['url'] = e.target.result;
			      	img['upload'] = true;
			      	img['base64'] = base64: e.target.result;
			      	img['name'] = fileInput.target.files[0].name;
			      	img['parseImageFile'] = me.parse.getParseFile(fileInput.target.files[0].name, { base64: e.target.result });
			      	resolve(img);
			      }else{
			      	reject(img);
			      }
			  }
			  console.log(fileInput.target.files[0]);
			  reader.readAsDataURL(fileInput.target.files[0]);
		  
		}else{
			reject(img);
		}
	});
  }

}
