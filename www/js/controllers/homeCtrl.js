app.controller('HomeCtrl', function($scope, $parse, UserService, $ionicModal, $stateParams, $ionicSlideBoxDelegate, Stations, Posts, Users, $timeout, ionicMaterialInk, ionicMaterialMotion) {

	$scope.page = 0;
	$scope.displayLimit = 10; 

	$ionicModal.fromTemplateUrl('templates/signInSignUp-modal.html', {
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.modal = modal;
	});

	$scope.hasDefaultStation = localStorage.getItem("defaultStation");
	$scope.currentUser = UserService.getCurrentUser();
	$scope.stations = Stations.all();

	$scope.post = {};

	var promise = UserService.getPost($scope.page, $scope.displayLimit);
	promise.then(function(posts){
		$scope.posts = posts;
		$scope.page ++;
		//generate ng-show variables for all the posts 
		for(var i=0;i<$scope.posts.length;i++){
			//console.log($scope.posts[i]);
			var showPost = "showPost_"+$scope.posts[i].id;
			var showPostLiked = "showPostLiked_"+$scope.posts[i].id;
			$scope[showPost] = false;
			$scope[showPostLiked] = arrayHasUser($scope.posts[i].get("likes"), Parse.User.current());
			
			if($scope.posts[i].get("data").type == "picture"){
				var variable = "postHasImage_"+$scope.posts[i].id;
				$scope[variable] = true;
			}

			//to access the dynamically created variable do the following
			//var x = i+1;
			//console.log($scope["showPost_"+x]);
		}
	}, function(error){
		alert("error fetching posts");
	})

	

	$scope.showWeatherDetails = true;

	$scope.defaultWeatherStation = {};

	if($scope.hasDefaultStation == false || $scope.hasDefaultStation == undefined || $scope.hasDefaultStation == "false"){
		console.log("$scope.hasDefaultStation == undefined");
		$scope.hasDefaultStation = false;
	}else{
		$scope.defaultWeatherStation = JSON.parse(localStorage.getItem("defaultStation"))
		$scope.hasDefaultStation = true;
	}

	$scope.setDefaultStation = function (){
		if(Stations.getStation($scope.defaultWeatherStation.value) != null){
			localStorage.setItem("hasDefaultStation", true);
			localStorage.setItem("defaultStation", JSON.stringify(Stations.getStation($scope.defaultWeatherStation.value)));
		    
		    setTimeout(function () {
		        $scope.$apply(function () {
		        	$scope.defaultWeatherStation = JSON.parse(localStorage.getItem("defaultStation"))
					$scope.hasDefaultStation = true;
					location.reload();
		        });
		    }, 100);
		}
	}

	$scope.showOrHidePost = function(post){
		var variable = "showPost_"+post.objectId;
		$scope[variable] = !$scope[variable];
		//$scope.$apply();
	}

	$scope.showOrHideWeatherDetails = function(){
		$scope.showWeatherDetails = !$scope.showWeatherDetails;
		//$scope.$apply();
	}

	$scope.submitComment = function(post){
		if(Parse.User.current()){
			if(document.getElementById("comment_"+post.id).value){
				var Comment = Parse.Object.extend("Comment");
				var comment = new Comment();
				comment.set("user", Parse.User.current());
				comment.set("post", post);
				var data =  {
			      type: "text",
			      value: document.getElementById("comment_"+post.id).value
			    }
			    comment.set("data", data);
			    comment.set("isDeleted", false);
			    comment.save(null, {
			    	success: function(comment){
			    		post.get("comments").push(comment);
			    		post.save(null, {
			    			success: function(post){
			    				$scope["showPost_"+post.id] = true;
			    				document.getElementById("comment_"+post.id).value = "";
			    				$scope.$apply();
			    			},
			    			error: function(post, error){

			    			}
			    		});
			    	},
			    	error: function(comment, error){

			    	}
			    });
			}else{
				console.log("do nothing as nothing typed in for the comment");
			}
		}else{
			$scope.modal.show();
		}
	}

	$scope.likeUnlikePost = function(post){
		if(Parse.User.current()){
			if(arrayHasUser(post.get("likes"), Parse.User.current())){
				//unlike post
				var newLikesArray = post.get("likes").filter(function(user) { return user.id !== Parse.User.current().id })
				post.set("likes", newLikesArray);
				post.save(null, {
					success: function(post){
						$scope["showPostLiked_"+post.id] = false;
						$scope.$apply();
					},
					error: function(post, error){

					}
				})

			}else{
				//like post
				post.get("likes").push(Parse.User.current());
				post.save(null, {
					success: function(post){
						$scope["showPostLiked_"+post.id] = true;
						$scope.$apply();
					},
					error: function(post, error){

					}
				})
			}
			
		}
	}

	$scope.submitPost = function(){
		if(Parse.User.current()){
			
			if($scope.post.text && $scope.post.text.length != 0 ){
				var Post = Parse.Object.extend("Post");
				var post = new Post();

				post.set("user", Parse.User.current());
				var promise = UserService.getLocationObject();
				promise.then(function(locationObject) {
					post.set("location", locationObject);
					post.set("data", getPostDataObject ($scope));
					post.set("likes", []);
					post.set("comments", []);
					post.set("isDeleted", false);
					post.save(null, {
					  success: function(post) {
					    // Execute any logic that should take place after the object is saved.
					    // alert('New post object created with objectId: ' + post.id);

					    //add the users post to the posts array 
					    $scope.posts.unshift(post)
					    $scope.post = {};
					    $scope.$apply();

					  },
					  error: function(post, error) {
					    // Execute any logic that should take place if the save fails.
					    // error is a Parse.Error with an error code and message.
					    alert('Failed to create new object, with error code: ' + error.message);
					  }
					});

				}, function(error) {
					//error getting user location for some reason
					console.log(error);
				});
			}else{
				//also check for an image file 
				console.log("nothing to post post");
			}

		}else{
			$scope.modal.show();
		}
	}

});

function getPostDataObject ($scope){
	var data = {
		type: "text",
    	value: $scope.post.text
	}
	return data;
}

function arrayHasUser(array, searchUser){
	var result = array.filter(function(user) {
	    return user.id === searchUser.id;
	});

	if(result.length){
		return true;
	}else{
		return false;
	}
}