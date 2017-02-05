import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// import services
import {FeedService} from '../services/socialmedia-service';
import {WeatherService} from '../providers/weather-service/weather-service';
import {UserService} from '../services/user-service';

// import pages
import {HomePage} from '../pages/home/home';
import {WeatherPage} from '../pages/weather/weather';
import {LoginPage} from '../pages/login/login';
import {LogoutPage} from '../pages/logout/logout';
import {RegisterPage} from '../pages/register/register';
import {UserPage} from '../pages/user/user';

//import modals
import {CommentsModal} from '../pages/comment-modal/modal-content';

@NgModule({
  declarations: [
    MyApp,
    CommentsModal,
    HomePage,
    WeatherPage,
    LoginPage,
    LogoutPage,
    RegisterPage,
    UserPage
  ],
  imports: [
    IonicModule.forRoot(MyApp
      /*
       * MODIFY BOOTSTRAP CODE BELOW
       * Adds a config object that disables scrollAssist and autoFocusAssist for iOS only
       * https://github.com/driftyco/ionic/issues/5571
       */
      , {
        platforms : {
          android : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          },
          browser : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          }
          // http://ionicframework.com/docs/v2/api/config/Config/)
        }
      }
      /*
       * END MODIFY
       */
      )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CommentsModal,
    HomePage,
    WeatherPage,
    LoginPage,
    LogoutPage,
    RegisterPage,
    UserPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedService,
    UserService,
    WeatherService
    /* import services */
    ]
})
export class AppModule {}
