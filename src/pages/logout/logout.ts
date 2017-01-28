import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {LoginPage} from "../login/login";

import Parse from 'parse';

/*
 Generated class for the LogoutPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class LogoutPage {
  constructor(
  	public nav: NavController
  ) {
  	Parse.User.logOut();
    this.nav.setRoot(LoginPage);  	
  }
}
