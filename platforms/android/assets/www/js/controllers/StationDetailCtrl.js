app.controller('StationDetailCtrl', function($scope, $ionicPopover, $stateParams, Stations, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	$scope.station = Stations.getStation($stateParams.stationId);
	console.log($scope.station);

	// .fromTemplateUrl() method
	  $ionicPopover.fromTemplateUrl('templates/stationDetailsCardPopover.html', {
	    scope: $scope
	  }).then(function(popover) {
	    $scope.popover = popover;
	  });

	$scope.openPopover = function($event) {
	    $scope.popover.show($event);
	  };
	  $scope.closePopover = function() {
	    $scope.popover.hide();
	  };
	  //Cleanup the popover when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.popover.remove();
	  });
	  // Execute action on hidden popover
	  $scope.$on('popover.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove popover
	  $scope.$on('popover.removed', function() {
	    // Execute action
	  });
});