import { NgModule, ErrorHandler } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { UserPage } from '../pages/user/user';

import { ErrorHandlerService } from '../providers/error-handler-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { SyncService } from '../providers/sync-service';
import { LocalDBService } from '../providers/local-db-service';
import { ParseProvider } from '../providers/parse-provider';
import { ImageService } from '../providers/image-service';
import { WeatherService } from '../providers/weather-service';
import { LazyImgComponent } from '../components/lazy-img.component';

import { CommentsModal } from '../pages/comment-modal/modal-content';
import { PopoverPage } from '../components/home-card-popover/home-card-popover';
import { WeatherPage } from '../pages/weather/weather';
import { ForecastPage } from '../pages/forecast/forecast';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    LazyImgComponent,
    UserPage,
    CommentsModal,
    PopoverPage,
    WeatherPage,
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
       )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    LazyImgComponent,
    UserPage,
    CommentsModal,
    PopoverPage,
    WeatherPage,
    ForecastPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    ParseProvider,
    ConnectivityService,
    Storage,
    ErrorHandlerService,
    LocalDBService,
    ImageService,
    SyncService,
    WeatherService]
})
export class AppModule {}
