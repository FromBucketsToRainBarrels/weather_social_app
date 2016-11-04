app.controller('StationDetailCtrl', function($scope, $stateParams, Stations, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	$scope.station = Stations.get($stateParams.stationId);
	console.log($scope.station);
});