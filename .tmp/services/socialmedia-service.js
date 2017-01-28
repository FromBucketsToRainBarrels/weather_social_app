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
import Parse from 'parse';
import { Events } from 'ionic-angular';
export var FeedService = (function () {
    function FeedService(events) {
        this.events = events;
    }
    FeedService.prototype.getFeed = function (n) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var Post = Parse.Object.extend("Post");
            var post = new Parse.Query(Post);
            post.descending('createdAt');
            post.limit(7);
            post.skip(n * 7);
            post.include("user");
            post.include("user.information");
            post.include("comments");
            post.include("likes");
            post.descending("createdAt");
            post.equalTo("isDeleted", false);
            post.find({
                success: function (posts) {
                    me.feed = posts;
                    resolve(me.feed);
                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                    reject(error);
                }
            });
        });
    };
    FeedService.prototype.addPost = function (post_data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var me = _this;
            var Post = Parse.Object.extend("Post");
            var post = new Post();
            post.set("user", Parse.User.current());
            post.set("isDeleted", false);
            post.set("text", post_data.text);
            post.set("likes_count", 0);
            post.set("comments_count", 0);
            if (post_data.attachment_photo) {
                post.set("type", "photo");
                var Image = Parse.Object.extend("Image");
                var img = new Image();
                img.set("image", post_data.attachment_photo_parseFile);
                img.save(null, {
                    success: function (img) {
                        post.set("images", [img.get('image').url()]);
                        me.savePost(post).then(function (p) {
                            resolve(p);
                        }).catch(function (ex) {
                            reject(ex);
                        });
                    },
                    error: function (img, error) {
                        reject(error);
                    }
                });
            }
            else {
                post.set("type", "text");
                me.savePost(post).then(function (p) {
                    resolve(p);
                }).catch(function (ex) {
                    reject(ex);
                });
            }
        });
    };
    FeedService.prototype.savePost = function (post) {
        var me = this;
        return new Promise(function (resolve, reject) {
            post.save(null, {
                success: function (post) {
                    me.feed.unshift();
                    resolve(post);
                },
                error: function (post, error) {
                    reject(error);
                }
            });
        });
    };
    FeedService.prototype.addComment = function (post, c) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var Comment = Parse.Object.extend("Comment");
            var comment = new Comment();
            comment.set("user", Parse.User.current());
            comment.set("post", post);
            comment.set("isDeleted", false);
            comment.set("type", "text");
            comment.set("text", c);
            comment.save(null, {
                success: function (comment) {
                    me.events.publish('comment_post_complete', comment);
                    var relation = post.relation("comments");
                    relation.add(comment);
                    post.set("comments_count", post.get("comments_count") + 1);
                    post.save(null, {
                        success: function (post) {
                            resolve(comment);
                        },
                        error: function (post, error) {
                            reject(error);
                        }
                    });
                },
                error: function (comment, error) {
                    console.log("Error : " + error.message);
                    reject(error);
                }
            });
        });
    };
    FeedService.prototype.getComments = function (post) {
        return new Promise(function (resolve, reject) {
            var relation = post.relation("comments");
            var query = relation.query();
            query.ascending("createdAt");
            query.find({
                success: function (comments) {
                    resolve(comments);
                },
                error: function (comments, error) {
                    reject(error);
                }
            });
        });
    };
    FeedService.prototype.getLikes = function (post) {
        var relation = post.relation("likes");
        var query = relation.query();
        query.limit(10);
        query.skip(0 * 10);
        query.find({
            success: function (likes) {
            }
        });
    };
    FeedService.prototype.likeUnlikePost = function (post) {
        var me = this;
        var query = new Parse.Query("Post");
        var relation = post.relation("likes");
        query.equalTo("likes", Parse.User.current());
        query.equalTo("objectId", post.id);
        query.find().then(function (response) {
            return response;
        }).then(function (likes) {
            console.log(likes);
            if (likes.length) {
                relation.remove(Parse.User.current());
                post.set("likes_count", post.get("likes_count") - 1);
            }
            else {
                relation.add(Parse.User.current());
                post.set("likes_count", post.get("likes_count") + 1);
            }
            post.save();
        });
    };
    FeedService.prototype.getAll = function () {
        return this.feed;
    };
    FeedService.prototype.getItem = function (id) {
        for (var i = 0; i < this.feed.length; i++) {
            if (this.feed[i].id === parseInt(id)) {
                return this.feed[i];
            }
        }
        return null;
    };
    FeedService.prototype.remove = function (item) {
        this.feed.splice(this.feed.indexOf(item), 1);
    };
    FeedService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Events])
    ], FeedService);
    return FeedService;
}());
//# sourceMappingURL=socialmedia-service.js.map