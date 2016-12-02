app.controller('AppCtrl', function ($scope, UserService, $ionicLoading, ParseConfiguration, $ionicModal, $ionicPopover, $timeout) {

    UserService.init();

    $scope.myDate = new Date().toISOString();

    $scope.signInSignUpModal = true;
    $scope.ParseConfiguration = ParseConfiguration;
    $scope.profilePic = "img/user1.png";
    $scope.isLoggedIn = false;
    $scope.uploadProfilePicture = {};
    $scope.currentUser = null;

    $scope.loadingTemplate = '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>';
    
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

    $ionicModal.fromTemplateUrl('templates/newPost-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.newPostModal = modal;
    });

    $ionicLoading.show({
          template: $scope.loadingTemplate
    });

    
    var promise = UserService.currentUser();
    promise.then(function(user) {
        //user is logged in
        $scope.isLoggedIn = true;

        if(UserService.getCurrentUser() == null){
            alert("UserService.getCurrentUser() == null");
            UserService.getUser(Parse.User.current())
              .then(function (_response) {
                  $scope = afterGetUser($scope, UserService, _response);
                  $ionicLoading.hide();
              }, function (_error) {
                  $ionicLoading.hide();
                  console.error("error getting user in " + _error.message);
              })
        }else{
            if(window.cordova && window.cordova.plugins) {
                
                if(navigator.connection.type == Connection.NONE) {
                    // no internet connection use localstorage data
                    $scope.currentUser = UserService.getCurrentUser();
                    $scope.profilePic = $scope.currentUser.information.profilePhoto.url;
                    $scope.isLoggedIn = true;
                    $ionicLoading.hide();
                }else{
                    // device has internet so we can fetch updated data
                    UserService.getUser(Parse.User.current())
                      .then(function (_response) {
                          $scope = afterGetUser($scope, UserService, _response);
                          $ionicLoading.hide();
                      }, function (_error) {
                          $ionicLoading.hide();
                          console.error("error getting user in " + _error.message);
                      })
                }
            }else{ 
                //this part of the code is for browser testing not used for production
                UserService.getUser(Parse.User.current())
                  .then(function (_response) {
                      $scope = afterGetUser($scope, UserService, _response);
                  }, function (_error) {
                      $ionicLoading.hide();
                      console.error("error getting user in " + _error.message);
                  })
                  $ionicLoading.hide();
            }
            
        }

    }, function(reason) {
        // not logged in 
        $scope.currentUser = null;
        $ionicLoading.hide();
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
    
    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    
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

    $scope.editProfile = function(){
        if(Parse.User.current()){
          $scope.editModal.show();
        }else{
          $scope.modal.show();
        }
    }

    $scope.hideSignInSignUpModal = function(){
        $scope.modal.hide();
    }

    $scope.passwordChange = function(){
        if(!$scope.showPasswordChange){ 
            $scope.showPasswordChange = true;
        }else{ 
            $scope.showPasswordChange = !$scope.showPasswordChange;
        }
    }

    $scope.doLogOutAction = function(){
      if(window.cordova && window.cordova.plugins){
        var deviceTokenPromise =  UserService.getThisDeviceToken();
        deviceTokenPromise.then(function(token){
          var installationPromise = UserService.getInstallation(token);
          installationPromise.then(function(installation) {
            var now = new Date();
            installation[0].set("lastOnline", now);
            installation[0].set("loginStatusOnDevice", "logged out");
            installation[0].save(null, {
                success: function(installation){
                  var logoutPromise = UserService.logout();
                  logoutPromise.then(function(_response){
                    UserService.setCurrentUser(null);
                    window.location.reload(true);
                  }, function(error){
                    alert("Error : " + error.message);
                  });
                },
                error: function(installation, error){
                  alert("Error : " + error.message);
                }
            });
          }, function(error){
            alert("Error : " + error.message);
          });
        }, function(error){
          alert("Error : " + error.message);
        });
      }else{
        // browser code
        UserService.logout();
        UserService.setCurrentUser(null);
        window.location.reload(true);
      }
        
    }

    $scope.doLoginAction = function (loginData) {
        // loginData = {};
        // loginData.email = "tanzeelrana@live.com";
        // loginData.password =  "Turr1.Turr1.";
        if(loginData == null || loginData == undefined){
          alert("Please enter login credentials");
        }else if(loginData.email == undefined){
          alert("Please enter a valid email address")
        }else if(loginData.password == undefined){
          alert("Please enter a password")
        }else{
          $ionicLoading.show({
            template: $scope.loadingTemplate
          });
          UserService.login(loginData.email, loginData.password)
          .then(function (_response) {
              UserService.getUser(_response)
                  .then(function (_response) {
                      UserService.setCurrentUser(_response[0]);
                      $scope.currentUser = UserService.getCurrentUser();
                      $scope.isLoggedIn = true;
                      UserService.updateInstallation();
                      if($scope.currentUser.information.profilePhoto.url != undefined){
                          $scope.profilePic = $scope.currentUser.information.profilePhoto.url;
                          $scope.profilePic = fixFileURL($scope.profilePic, $scope.ParseConfiguration.serverIPAdress);
                      }
                      $scope.$apply();
                      $scope.modal.hide();
                      $ionicLoading.hide();
                  }, function (_error) {
                      alert("error getting user in " + _error.message);
                  })
          }, function (_error) {
              alert("error logging in " + _error.message);
              $ionicLoading.hide();
          })
        }      
    };

    $scope.signUpUser = function (signUpData) {
        
        $ionicLoading.show({
          template: $scope.loadingTemplate
        });

        UserService.createUser(signUpData).then(function (_response) {
            UserService.getUser(_response)
            .then(function (_response){ 
                UserService.setCurrentUser(_response[0]);
                $scope.currentUser = UserService.getCurrentUser();
                UserService.updateInstallation();
                $scope.isLoggedIn = true;
                $scope.$apply();

                $ionicLoading.hide();
                $scope.modal.hide();
            })
            
        }, function (_error) {
            alert("Error Creating User Account " + _error.debug)
        });
    }

    $scope.uploadProfile = function(){
        $ionicLoading.show({
              template: $scope.loadingTemplate
        });

        UserService.updateProfile($scope.uploadProfilePicture, $scope.currentUser)
        .then(function (_response) {
            alert("UserService.updateProfile() response got");
            UserService.getUser(_response)
                .then(function (_response){ 
                    UserService.setCurrentUser(_response[0]);
                    $scope.profilePic = fixFileURL(_response[0].get("information").get("profilePhoto").url(), $scope.ParseConfiguration.serverIPAdress);
                    $scope.currentUser.information.profilePhoto.url = $scope.profilePic;
                    $scope.uploadProfilePicture.src = null;
                    $ionicLoading.hide();
                    $scope.$apply();
                })
        }, function (_error) {
            alert("error updating profile error.message : " + _error.message);
            $ionicLoading.hide();
        })
    }
});

function fixFileURL(oldURL, serverIPAdress){
    return oldURL.replace("localhost", serverIPAdress);
}

function afterGetUser($scope, UserService, _response){ 
    UserService.setCurrentUser(_response[0]);
    $scope.currentUser = UserService.getCurrentUser();
    $scope.isLoggedIn = true;
    if($scope.currentUser.information.profilePhoto.url != undefined){
      $scope.profilePic = $scope.currentUser.information.profilePhoto.url;
      $scope.profilePic = fixFileURL($scope.profilePic, $scope.ParseConfiguration.serverIPAdress);
    }
    $scope.$apply();
    return $scope;
}