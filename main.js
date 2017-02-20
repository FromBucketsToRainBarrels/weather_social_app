//this is cloud code for the application

var pagination_limit = 7;
var comments_pagination_limit = 10;
module.paths.push('/usr/local/lib/node_modules');

// var stringify = require('node-stringify');
// var parser = require('json-parser');

Parse.Cloud.define("getUserStations", function(request, response) {
  
  console.log(JSON.stringify(request));
  
});

Parse.Cloud.define("updateFeed", function(request, response) {
  
  console.log(JSON.stringify(request));

  //updateFeed will always pass a 0 index as user is asking for new posts on his/her feed
  getFeed(0).then((response) => {
	  return response;
	}).then((feed) => {
	  var feedObj = {posts:feed, start:1};
	  feedObj = getAsJSON(feedObj);
	  response.success(feedObj);
	}).catch((ex) => {
	  response.error(ex);
	});

});

Parse.Cloud.define("getMoreFeed", function(request, response) {
  
  console.log(JSON.stringify(request));

  //updateFeed will always pass a 0 index as user is asking for new posts on his/her feed
  getFeed(request.params.start).then((response) => {
	  return response;
	}).then((posts) => {
	  response.success(getAsJSON(posts));
	}).catch((ex) => {
	  response.error(ex);
	});

});

function getFeed(n){
	return new Promise((resolve, reject) => {
	  
	  var textPost = new Parse.Query("Post");
	  textPost.equalTo("type", "text");
	  var imagePost = new Parse.Query("Post");
	  imagePost.equalTo("type", "photo");

	  var mainQuery = Parse.Query.or(textPost, imagePost);
	  
	  mainQuery.descending('createdAt');
	  mainQuery.limit(pagination_limit);
	  mainQuery.skip(n*pagination_limit);
	  mainQuery.include("user");
	  mainQuery.include("user.information");
	  mainQuery.include("comments");
	  mainQuery.include("likes");	  
	  mainQuery.descending("createdAt");
	  mainQuery.equalTo("isDeleted", false);

	  mainQuery.find({
	    success: function(posts) {

	      resolve(posts);
	    },
	    error: function(error) {
	      console.log("Error: " + error.code + " " + error.message);
	      reject(error);
	    }
	  });
	});
}

Parse.Cloud.define("likePost", function(request, response) {
  	var postId = request.params.post;
    var Post = Parse.Object.extend("Post");
    var post = new Parse.Query(Post);
    
    post.get(postId, {
      success: function(p) {
        var relation = p.relation("likes");
        var query = relation.query();
        query.equalTo("objectId", request.params.user);
        query.find().then((res) => {
          return res;
        }).then((likes) => {
        	var liked;
          if(likes.length){
            relation.remove(request.user);
            p.set("likes_count",p.get("likes_count")-1);
            liked = false;
          }else{
            relation.add(request.user);
            p.set("likes_count",p.get("likes_count")+1);
            liked = true;
          }
          p.save();
          response.success({count:p.get("likes_count"), liked: liked});
        });
      },
      error: function(post, error) {
        console.log(error);
        response.error(error);
      }
    });
});

Parse.Cloud.define("getPostComments", function(request, response) {
	getPostById(request.params.post).then((_p_res) => {
		return _p_res;
	}).then((post) => {
		getPostComments(post).then((_c_res) => {
			return _c_res;
		}).then((comments) => {
			response.success(getAsJSON(comments));
		}).catch((error) => {
			response.error(error);
		});
	}).catch((error) => {
		response.error(error);
	});
});

Parse.Cloud.define("commentPost", function(request, response) {
	
	getPostById(request.params.post).then((res) => {
		return res;
	}).then((post) => {
		var Comment = Parse.Object.extend("Comment");
		var comment = new Comment();
		comment.set("user", request.user);
		comment.set("post", post);
		comment.set("isDeleted", false);
		comment.set("type","text");
		comment.set("text",request.params.c);
		comment.save(null, {
			success: function(comment) {
			  var relation = post.relation("comments");
			  relation.add(comment);
			  post.set("comments_count",post.get("comments_count") + 1);
			  post.save(null, {
			    success: function(p){
			      response.success(getAsJSON(comment));
			    },
			    error: function(post, error){
			      response.error(error);
			    }
			  });
			},
			error: function(comment, error) {
			  console.log("Error : " + error.message);
			  response.error(error);
			}
		});
	}).catch((error) => {
		response.error(error);
	});
});

function getPostById(postId){
	return new Promise((resolve, reject) => {
		var Post = Parse.Object.extend("Post");
	    var post = new Parse.Query(Post);
	    post.get(postId, {
	      success: function(p) {
	        resolve(p);
	      },
	      error: function(post, error) {
	        reject(error);
	      }
	    });
	});
}

function getPostComments(post){
    return new Promise((resolve, reject) => {
      var relation = post.relation("comments");
      var query = relation.query();
      query.ascending("createdAt");
      query.find({
        success: function(comments){
          resolve(comments);
        },
        error: function(comments,error){
          reject(error);
        }
      });
    });
}

function getAsJSON(obj){
	var x = JSON.stringify(obj);
	var x = x.replace(/localhost/g,'162.243.118.87');
    return x;
}
