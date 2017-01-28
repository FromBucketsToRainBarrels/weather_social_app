var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { CHATS } from "./mock-chats";
export var ChatService = (function () {
    function ChatService() {
        this.chats = CHATS;
    }
    ChatService.prototype.getAll = function () {
        return this.chats;
    };
    ChatService.prototype.getItem = function (id) {
        for (var i = 0; i < this.chats.length; i++) {
            if (this.chats[i].id === parseInt(id)) {
                return this.chats[i];
            }
        }
        return null;
    };
    ChatService.prototype.remove = function (item) {
        this.chats.splice(this.chats.indexOf(item), 1);
    };
    ChatService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], ChatService);
    return ChatService;
}());
//# sourceMappingURL=chat-service.js.map