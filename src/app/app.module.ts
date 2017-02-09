import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Storage } from '@ionic/storage';
import { ChartsModule } from 'ng2-charts';

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
import {MarketPage} from '../pages/market/market';
import {ForecastPage} from '../pages/forecast/forecast';

//import modals
import {CommentsModal} from '../pages/comment-modal/modal-content';
import {SellModal} from '../pages/sell-modal/modal-content';


@NgModule({
  declarations: [
    MyApp,
    CommentsModal,
    SellModal,
    HomePage,
    WeatherPage,
    LoginPage,
    LogoutPage,
    RegisterPage,
    UserPage,
    MarketPage,
    ForecastPage
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
      ),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CommentsModal,
    SellModal,
    HomePage,
    WeatherPage,
    LoginPage,
    LogoutPage,
    RegisterPage,
    UserPage,
    MarketPage,
    ForecastPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedService,
    UserService,
    WeatherService,
    Storage
    /* import services */
    ]
})
export class AppModule {}
