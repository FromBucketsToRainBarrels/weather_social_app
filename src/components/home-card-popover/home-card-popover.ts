import { Component} from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: "home-card-popover.html"
})

export class PopoverPage {

	public data: any;

  constructor(
  	public viewCtrl: ViewController,
  	public params: NavParams,
  ) {
  	this.data = this.params.data;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}