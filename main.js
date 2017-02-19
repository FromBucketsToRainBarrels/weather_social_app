//this is cloud code for the application
var pagination_limit = 7;

Parse.Cloud.define("getUserStations", function(request, response) {
  
  console.log(JSON.stringify(request));
  
});

Parse.Cloud.define("updateFeed", function(request, response) {
  
  console.log(JSON.stringify(request));

  //updateFeed will always pass a 0 index as user is asking for new posts on his/her feed
  getFeed(0).then((response) => {
	  return response;
	}).then((feed) => {
	  var feedObj = {posts: feed, start:0};
	  response.success(feedObj);
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

function getAsJSON(parseObj){
    return JSON.parse(JSON.stringify(parseObj));
}