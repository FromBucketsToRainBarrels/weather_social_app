import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

// import services
import {FeedService} from '../services/socialmedia-service';
import {WeatherService} from '../providers/weather-service/weather-service';
import {UserService} from '../services/user-service';

// end import services
// end import services

// import pages
import {AboutPage} from '../pages/about/about';
import {ChatDetailPage} from '../pages/chat-detail/chat-detail';
import {ChatsPage} from '../pages/chats/chats';
import {HomePage} from '../pages/home/home';
import {WeatherPage} from '../pages/weather/weather';
import {LoginPage} from '../pages/login/login';
import {LogoutPage} from '../pages/logout/logout';
import {NewsPage} from '../pages/news/news';
import {RegisterPage} from '../pages/register/register';
import {UserPage} from '../pages/user/user';
// end import pages

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ChatDetailPage,
    ChatsPage,
    HomePage,
    WeatherPage,
    LoginPage,
    LogoutPage,
    NewsPage,
    RegisterPage,
    UserPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ChatDetailPage,
    ChatsPage,
    HomePage,
    WeatherPage,
    LoginPage,
    LogoutPage,
    NewsPage,
    RegisterPage,
    UserPage
  ],
  providers: [
    FeedService,
    UserService,
    WeatherService
    /* import services */
  ]
})
export class AppModule {
}
