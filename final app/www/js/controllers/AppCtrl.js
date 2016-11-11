app.controller('AppCtrl', function ($scope, $ionicModal, Users, Stations, $ionicPopover, $timeout) {

    $scope.currentUser = Users.getCurrentUser();
    //check for internet connectivity and accordingly fetch data from the services or from localStorage
    if(window.cordova) {
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            console.log('There is no internet connection available');
            $scope.stations = JSON.parse(localStorage.getItem("stations"));
            console.log("using local data from local storage : " + $scope.stations);
        }else{
            console.log(navigator.connection.type);
            //fetch new data 
            $scope.stations = Stations.all();
            localStorage.setItem("stations", JSON.stringify($scope.stations));
        }
      }
    }else{
        console.log('browser user navigator.onLine to check conectivity');
        console.log("navigator.onLine : " + navigator.onLine)
        if(navigator.onLine){
          //fetch new data 
          $scope.stations = Stations.all();
          localStorage.setItem("stations", JSON.stringify($scope.stations));
        }else{
          // use local data from local storage
          $scope.stations = JSON.parse(localStorage.getItem("stations"));
          console.log("using local data from local storage : " + $scope.stations);  
        }
    }

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    var fab = document.getElementById('fab');
    fab.addEventListener('click', function () {
        //location.href = 'https://twitter.com/satish_vr2011';
        window.open('https://twitter.com/satish_vr2011', '_blank');
    });

    // .fromTemplate() method
      var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

      $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
      });

      // .fromTemplateUrl() method
      $ionicPopover.fromTemplateUrl('templates/popover.html', {
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