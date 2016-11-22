app.controller('AppCtrl', function ($scope, $ionicModal, $ionicLoading, ParseConfiguration, UserService, Users, Stations, $ionicPopover, $timeout) {

  $scope.signInSignUpModal = true;
  $scope.ParseConfiguration = ParseConfiguration;
  $scope.updateProfileData = {};

  $scope.loadingTemplate = '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>';
  $ionicLoading.show({
          template: $scope.loadingTemplate
  });

  //databinding for modal
    $scope.uploadProfilePicture = {};
  $ionicModal.fromTemplateUrl('templates/editProfile-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.editModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/signInSignUp-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  if(UserService.getCurrentUser() == null){
    //if the web user presses refresh button need to fetch this again
    UserService.getUser(Parse.User.current())
      .then(function (_response) {
          UserService.setCurrentUser(_response[0]);
          $scope.currentUser = _response[0];

          $scope.updateProfileData.firstName = _response[0].get("information").get("firstName");

          if($scope.currentUser.get("information").get("profilePhoto") != undefined){
              $scope.profilePic = $scope.currentUser.get("information").get("profilePhoto").url();
              $scope.profilePic = fixFileURL($scope.profilePic, $scope.ParseConfiguration.serverIPAdress);
          }
          $ionicLoading.hide();
          //console.log("user refetched : " + JSON.stringify(_response[0]));
      }, function (_error) {
          $ionicLoading.hide();
          alert("error getting user in " + _error.message);
      })
  }else{
    $scope.currentUser = UserService.getCurrentUser();
  }

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
      //location.href = 'https://google.com';
      //window.open('https://google.com', '_blank');
      if($scope.currentUser != null){
        //here we show a modal for a new post

      }else{
        //here we will show a modal for sign in or sign up
        $scope.modal.show();
      }
  });

  $scope.editProfile = function(){
    $scope.editModal.show();
  }

  $scope.hideSignInSignUpModal = function(){
    $scope.modal.hide();
  }

  $scope.doLoginAction = function (loginData) {
    if(loginData == null || loginData == undefined){
      alert("Please enter login credentials");
    }else if(loginData.email == undefined){
      alert("Please enter a valid email address")
    }else if(loginData.password == undefined){
      alert("Please enter a password")
    }else{
      UserService.login(loginData.email, loginData.password)
      .then(function (_response) {

          UserService.getUser(_response)
              .then(function (_response) {
                  
                  UserService.setCurrentUser(_response[0]);

                  if(window.cordova && window.cordova.plugins){
                      FCMPlugin.getToken(
                        function(token){
                          //alert(token);

                          $scope.modal.hide();
                        },
                        function(err){
                          alert('error retrieving token: ' + err);
                          $scope.modal.hide();
                        }
                      )
                  }else{
                      $scope.modal.hide();
                  }
              }, function (_error) {
                  alert("error getting user in " + _error.message);
              })
      }, function (_error) {
        alert("error logging in " + _error.message);
        })
    }      
  };

  $scope.signUpUser = function (signUpData) {
    
    $ionicLoading.show({
      template: $scope.loadingTemplate
    });

    UserService.createUser(signUpData).then(function (_data) {
        $scope.user = _data;

        alert("Success Creating User Account ");
        $ionicLoading.hide();
        $scope.modal.hide();

    }, function (_error) {
        alert("Error Creating User Account " + _error.debug)
    });
  }

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

  $scope.uploadProfilePic = function(){
    if($scope.uploadProfilePicture.src){

      UserService.uploadFile($scope.uploadProfilePicture)
        .then(function (_response) {
            console.log(_response);
            $scope.profilePic = fixFileURL(_response.get("information").get("profilePhoto").url(), $scope.ParseConfiguration.serverIPAdress);
            $scope.currentUser.get("information").set("profilePhoto",_response);
            $scope.uploadProfilePicture.src = null;
            $scope.$apply();
        }, function (_error) {
            alert("error getting user in " + _error.message);
        })
    }
  }

  $scope.showSignIn = function(){
    $scope.signInSignUpModal = true;
  }

  $scope.showSignUp = function(){
    $scope.signInSignUpModal = false;
  }

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

function fixFileURL(oldURL, serverIPAdress){
    return oldURL.replace("localhost", serverIPAdress);
}