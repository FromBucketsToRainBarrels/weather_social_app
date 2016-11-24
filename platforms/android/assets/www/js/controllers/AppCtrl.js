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

    // var navIcons = document.getElementsByClassName('ion-navicon');
    // for (var i = 0; i < navIcons.length; i++) {
    //   navIcons.addEventListener('click', function () {
    //       this.classList.toggle('active');
    //   });
    // }

    // var fab = document.getElementById('fab');
    // fab.addEventListener('click', function () {
    //   //location.href = 'https://google.com';
    //   //window.open('https://google.com', '_blank');
    //   if($scope.currentUser != null){
    //     //here we show a modal for a new post
    //     $scope.newPostModal.show();
    //   }else{
    //     //here we will show a modal for sign in or sign up
    //     $scope.modal.show();
    //   }
    // });

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

    $scope.doLoginAction = function (loginData) {
        loginData = {};
        loginData.email = "tanzeelrana@live.com";
        loginData.password =  "Turr1.Turr1.";
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
                      if($scope.currentUser.information.profilePhoto.url != undefined){
                          $scope.profilePic = $scope.currentUser.information.profilePhoto.url;
                          $scope.profilePic = fixFileURL($scope.profilePic, $scope.ParseConfiguration.serverIPAdress);
                      }
                      $scope.$apply();
                      if(window.cordova && window.cordova.plugins){
                          FCMPlugin.getToken(
                            function(token){
                              //here we need to update the record for this specific device in the installation collection
                              //we update the user, lastOnline, loginStatusOnDevice and locationHistory otherwise 
                              //we will create a record for this specific device and store the respective information
                              //note : wwe need to make use of the cordova navigator here to get location geopoint
                              //alert("device token is : " + token);

                              $scope.modal.hide();
                              $ionicLoading.hide();
                            },
                            function(err){
                              alert('error retrieving token: ' + err);
                              $scope.modal.hide();
                              $ionicLoading.hide();
                            }
                          )
                      }else{
                          $scope.modal.hide();
                          $ionicLoading.hide();
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

        UserService.createUser(signUpData).then(function (_response) {

            UserService.getUser(_response)
            .then(function (_response){ 
                UserService.setCurrentUser(_response[0]);
                $scope.currentUser = UserService.getCurrentUser();
                $scope.isLoggedIn = true;
                $scope.$apply();

                //here we need to link the installation record of this 
                //device to the user that has just signed up from this device and 
                //update the respective collection columns

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