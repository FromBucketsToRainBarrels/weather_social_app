app.controller('HomeCtrl', function($scope, $parse, UserService, $ionicModal, $stateParams, $ionicSlideBoxDelegate, Stations, Posts, Users, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	
	$ionicModal.fromTemplateUrl('templates/signInSignUp-modal.html', {
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.modal = modal;
	});

	$scope.hasDefaultStation = localStorage.getItem("defaultStation");
	$scope.currentUser = UserService.getCurrentUser();
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

	$scope.showOrHidePost = function(id){
		var variable = "showPost_"+id;
		$scope[variable] = !$scope[variable];
		$scope.$apply();
	}

	$scope.showOrHideWeatherDetails = function(){
		$scope.showWeatherDetails = !$scope.showWeatherDetails;
		$scope.$apply();
	}

	$scope.submitComment = function(){
		if(Parse.User.current()){
			console.log("submitting comment");
		}else{
			$scope.modal.show();
		}
	}

});