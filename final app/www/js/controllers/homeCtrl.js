app.controller('HomeCtrl', function($scope, $parse, $stateParams, $ionicSlideBoxDelegate, Stations, Posts, Users, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	
	$scope.hasDefaultStation = localStorage.getItem("defaultStation");
	$scope.currentUser = Users.getCurrentUser();
	$scope.stations = Stations.all();
	$scope.posts = Posts.all();
	$scope.showWeatherDetails = true;

	//generate ng-show variables for all the posts 
	for(var i=0;i<$scope.posts.length;i++){
		//console.log($scope.posts[i]);
		var variable = "showPost_"+$scope.posts[i].id;
		$scope[variable] = false;
		
		if($scope.posts[i].data.type == "picture"){
			var variable = "postHasImage_"+$scope.posts[i].id;
			$scope[variable] = true;
		}

		//to access the dynamically created variable do the following
		//var x = i+1;
		//console.log($scope["showPost_"+x]);
	}

	$scope.defaultWeatherStation = {};

	if($scope.hasDefaultStation == false || $scope.hasDefaultStation == undefined || $scope.hasDefaultStation == "false"){
		console.log("$scope.hasDefaultStation == undefined");
		$scope.hasDefaultStation = false;
	}else{
		$scope.defaultWeatherStation = JSON.parse(localStorage.getItem("defaultStation"))
		$scope.hasDefaultStation = true;
	}

	$scope.setDefaultStation = function (){
		if(Stations.get($scope.defaultWeatherStation.value) != null){
			localStorage.setItem("hasDefaultStation", true);
			localStorage.setItem("defaultStation", JSON.stringify(Stations.get($scope.defaultWeatherStation.value)));
		    
		    setTimeout(function () {
		        $scope.$apply(function () {
		        	$scope.defaultWeatherStation = JSON.parse(localStorage.getItem("defaultStation"))
					$scope.hasDefaultStation = true;
					location.reload();
		        });
		    }, 100);	
		}
	}

	$scope.showOrHidePost = function(id){
		var variable = "showPost_"+id;
		$scope[variable] = !$scope[variable];
	}

	$scope.showOrHideWeatherDetails = function(){
		$scope.showWeatherDetails = !$scope.showWeatherDetails;
	}

	$scope.submitComment = function(){
		console.log("submitting comment");
	}

});