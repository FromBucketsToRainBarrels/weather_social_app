//this is cloud code for the application

var pagination_limit = 7;
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
  	console.log("postId : " + postId);
  	var Post = Parse.Object.extend("Post");
	var post = new Parse.Query(Post);
	post.get(postId, {
	  success: function(p) {
	  	console.log(post);
	    var query = new Parse.Query("Post");
	    var relation = p.relation("likes");
	    query.equalTo("likes", Parse.User.current());
	    query.equalTo("objectId", p.id);
	    query.find().then((res) => {
	      return res;
	    }).then((likes) => {
	    	console.log("likes : " + likes + " length : " + likes.length);
	      if(likes.length){
	        console.log("need to remove user from the relation");
	        relation.remove(Parse.User.current());
	        post.set("likes_count",post.get("likes_count")-1);
	      }else{
	      	console.log("need to add user to the relation");
	        relation.add(Parse.User.current());
	        post.set("likes_count",post.get("likes_count")+1);
	      }
	      post.save();
	      console.log("post.save() : likes_count : " + post.get("likes_count"));
	      response.success(post.get("likes_count"));
	    });
	  },
	  error: function(post, error) {
	  	console.log(error);
	    response.error(error);
	  }
	});
});


function getAsJSON(obj){
	var x = JSON.stringify(obj);
	var x = x.replace(/localhost/g,'162.243.118.87');
    return x;
}
