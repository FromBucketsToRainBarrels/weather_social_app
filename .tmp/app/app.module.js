var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FeedService } from '../services/socialmedia-service';
import { WeatherService } from '../providers/weather-service/weather-service';
import { UserService } from '../services/user-service';
import { AboutPage } from '../pages/about/about';
import { ChatDetailPage } from '../pages/chat-detail/chat-detail';
import { ChatsPage } from '../pages/chats/chats';
import { HomePage } from '../pages/home/home';
import { WeatherPage } from '../pages/weather/weather';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { NewsPage } from '../pages/news/news';
import { RegisterPage } from '../pages/register/register';
import { UserPage } from '../pages/user/user';
// end import pages
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
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
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map