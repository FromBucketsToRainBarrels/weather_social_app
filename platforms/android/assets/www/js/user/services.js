angular.module('user.services', [])

    .service('UserService', ['$q', 'ParseConfiguration',
        function ($q, ParseConfiguration) {

            var parseInitialized = false;

            var functions = {

                /**
                 *
                 * @returns {*}
                 */
                init: function () {
                    // if initialized, then return the activeUser
                    if (parseInitialized === false) {
                        Parse.serverURL = 'http://162.243.118.87:1337/parse';
                        Parse.initialize("FromBucketsToRainBarrels");
                        parseInitialized = true;
                        console.log("parse initialized in init function");
                    }
                    
                    var currentUser = Parse.User.current();
                    if (currentUser) {
                        return $q.when(currentUser);
                    } else {
                        return $q.reject({error: "noUser"});
                    }

                },
                /**
                 *
                 * @param _userParams
                 */
                createUser: function (_userParams) {

                    var user = new Parse.User();
                    user.set("username", _userParams.email);
                    user.set("email", _userParams.email);
                    user.set("password", _userParams.password);

                    // should return a promise
                    return $q(function(resolve, reject) {
                        user.signUp(null, {
                          success: function(user) {
                            //add an empty information object to the user record and save it again
                            var Information = Parse.Object.extend("Information");
                            var information = new Information();
                            information.set("user", user);
                            information.save(null, {
                              success: function(information) {
                                // Execute any logic that should take place after the object is saved.
                                console.log('New object created with objectId: ' + information.id);
                                resolve(user);
                              },
                              error: function(information, error) {
                                //this should not happen in any case will need to handle this later
                                console.log('Failed to create new information object, with error code: ' + error.message);
                                reject(error);
                              }
                            });
                          },
                          error: function(user, error) {
                            // Show the error message somewhere and let the user try again.
                            console.log("Error: " + error.code + " " + error.message);
                            reject(error);
                          }
                        });
                    })
                },
                /**
                 *
                 * @param _parseInitUser
                 * @returns {Promise}
                 */
                currentUser: function (_parseInitUser) {

                    // if there is no user passed in, see if there is already an
                    // active user that can be utilized
                    _parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();

                    console.log("_parseInitUser " + Parse.User.current());
                    if (!_parseInitUser) {
                        return $q.reject({error: "noUser"});
                    } else {
                        return $q.when(_parseInitUser);
                    }
                },
                /**
                 *
                 * @param _user
                 * @param _password
                 * @returns {Promise}
                 */
                login: function (_user, _password) {
                    return Parse.User.logIn(_user, _password);
                },
                /**
                 *
                 * @returns {Promise}
                 */
                logout: function (_callback) {
                    var defered = $q.defer();
                    Parse.User.logOut();
                    defered.resolve();
                    return defered.promise;
                },
                // custom functions for user service
                signUpCompany: function(signUpCompanyObject){
                    return Parse.Cloud.run('signUpCompany', signUpCompanyObject, {});
                },
                getUser: function(_user){
                    
                    var userQuery = new Parse.Query(Parse.User);
                    userQuery.equalTo("objectId", _user.id);
                    userQuery.include("information");
                    userQuery.include("information.currentAddress");
                    //Here you aren't directly returning a user, but you are returning a function that will $
                    return userQuery.find
                    ({
                        success: function(userRetrieved)
                        {
                            //When the success method fires and you return userRetrieved you fulfill the abo$
                            console.log("userRetrieved : " + userRetrieved);
                            return userRetrieved;
                        },
                        error: function(error)
                        {
                            return error;
                        }
                    });

                },
                setCurrentUser: function(currentUser){
                    //console.log("setCurrentUser : " + JSON.stringify(currentUser));
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                },
                getCurrentUser: function(){
                    //console.log("getCurrentUser : " + JSON.stringify(this.currentUserObject));
                    if(localStorage.getItem("currentUser") == undefined || localStorage.getItem("currentUser") == null){ 
                        return null;
                    }else{ 
                        return JSON.parse(localStorage.getItem("currentUser"));
                    }
                },
                updateProfile: function(_imageObject, currentUser){
                    if(_imageObject.src){ 
                        _imageObject.ext = /[^/]*$/.exec(_imageObject.src.match(/[^;]*/)[0])[0];
                        var parseFile = new Parse.File( Parse.User.current().id +"_"+ _imageObject.ext, { base64: _imageObject.src });
                        Parse.User.current().get("information").set("profilePhoto", parseFile);
                    }
                    
                    console.log(JSON.stringify(currentUser));

                    Parse.User.current().get("information").set("firstName", currentUser.information.firstName);
                    Parse.User.current().get("information").set("lastName", currentUser.information.lastName);
                    Parse.User.current().get("information").set("phone", currentUser.information.phone);

                    //need to provide password change support here

                    return Parse.User.current().save(null, {
                        success: function(user){
                            //return $q.when(user);
                        },
                        error: function(user, error){
                           //return $q.reject({error: error});
                        }
                    });
                },
                getLocationObject: function(){
                    return $q(function(resolve, reject) {
                        navigator.geolocation.getCurrentPosition( function(position) {
                            
                            var locationObject = {
                                  Latitude          : position.coords.latitude,          
                                  Longitude         : position.coords.longitude,         
                                  Altitude          : position.coords.altitude,          
                                  Accuracy          : position.coords.accuracy,          
                                  Altitude_Accuracy : position.coords.altitudeAccuracy,  
                                  Heading           : position.coords.heading,           
                                  Speed             : position.coords.speed,             
                                  Timestamp         : position.timestamp            
                            };

                            resolve(locationObject);
                        }, function (error) {
                            reject(error);
                        })
                    });
                },
                getPost: function(page, displayLimit) {

                    var Post = Parse.Object.extend("Post");
                    var post = new Parse.Query(Post);
                    post.descending('createdAt');
                    post.limit(displayLimit);
                    post.skip(page*displayLimit);
                    post.include("user");
                    post.include("user.information");
                    post.include("comments");
                    post.include("likes");
                    
                    return $q (function(resolve, reject) {
                        post.find({
                          success: function(posts) {
                            console.log("Successfully retrieved " + posts.length + " posts.");
                            resolve(posts);
                          },
                          error: function(error) {
                            console.log("Error: " + error.code + " " + error.message);
                            reject(error);
                          }
                        });
                    })
                },
                getInstallation: function(uuid){
                    var Installation = Parse.Object.extend("Installation");
                    var installation = new Parse.Query(Installation);
                    installation.equalTo("device_uuid", uuid);
                    installation.include("user");
                    return $q (function(resolve, reject) {
                        installation.find({
                          success: function(installation) {
                            console.log("Successfully retrieved " + installation.length + " installation.");
                            resolve(installation);
                          },
                          error: function(error) {
                            console.log("Error: " + error.code + " " + error.message);
                            reject(error);
                          }
                        });
                    })
                },
                
                getThisDeviceToken: function(){
                    if(window.cordova && window.cordova.plugins){
                        return $q (function(resolve, reject) {
                            FCMPlugin.getToken(
                                function(token){
                                    console.log("token : " + token);
                                    resolve(token);
                                }, function(error){
                                    console.log('error retrieving token: ' + error);
                                    reject(error);
                                }
                            )
                        })
                    }
                },
                updateInstallation: function(){
                    if(window.cordova && window.cordova.plugins){
                        FCMPlugin.getToken(
                          function(token){
                            console.log("token : " + token);
                            var installationPromise = functions.getInstallation(device.uuid);
                            installationPromise.then(function(installation){
                                console.log("installationPromise returned : " + installation);
                                var now = new Date();
                                
                                if(installation.length == 0){
                                    //this device is not registered  --> first time user 
                                    var Installation = Parse.Object.extend("Installation");
                                    var newInstallationRecord = new Installation();
                                    newInstallationRecord.set("deviceToken", token);
                                    newInstallationRecord.set("lastOnline", now);
                                    newInstallationRecord.set("userHistory", []);
                                    newInstallationRecord.set("user", Parse.User.current()); 
                                    newInstallationRecord.set("channels", []);
                                    newInstallationRecord.set("timeZone", now.getTimezoneOffset());
                                    newInstallationRecord.set("locationHistory", []);
                                    newInstallationRecord.set("device_model", device.model);
                                    newInstallationRecord.set("device_platform", device.platform);
                                    newInstallationRecord.set("device_uuid", device.uuid);
                                    newInstallationRecord.set("device_version", device.version);
                                    newInstallationRecord.set("device_manufacturer", device.manufacturer);
                                    newInstallationRecord.set("device_isVirtual", device.isVirtual);
                                    newInstallationRecord.set("device_serial", device.serial);
                                    var locationObjectPromise = functions.getLocationObject();
                                    locationObjectPromise.then(function(locationObject){
                                        console.log("got a locationObject : " + JSON.stringify(locationObject));
                                        newInstallationRecord.set("lastLocation", locationObject);
                                        newInstallationRecord.save(null, {
                                            success: function(newInstallationRecord){
                                                console.log("Saved installation object for this device into database");
                                            },
                                            error: function(newInstallationRecord, error){
                                                console.log("Error: " + error.code + " " + error.message);
                                            }
                                        })
                                    }, function(error){
                                        console.log("Error: " + error.code + " " + error.message);
                                        newInstallationRecord.save(null, {
                                            success: function(newInstallationRecord){
                                                console.log("Saved installation object for this device into database");
                                            },
                                            error: function(newInstallationRecord, error){
                                                console.log("Error: " + error.code + " " + error.message);
                                            }
                                        })
                                    });
                                }else{
                                    console.log("found a installation record for this device : " + installation);
                                    installation[0].set("lastOnline", now);
                                    installation[0].set("deviceToken", token);
                                    if(Parse.User.current()){
                                        console.log("Parse.User.current() == true");
                                        installation[0].set("loginStatusOnDevice", "logged in");
                                        if(installation[0].get("user") == undefined){
                                            installation[0].set("user", Parse.User.current());
                                        }else{
                                            if(installation[0].get("user").get("username") != Parse.User.current().get("username")){
                                               var userHistory =  installation[0].get("userHistory");
                                               userHistory.push(installation[0].get("user"));
                                               installation[0].set("userHistory", userHistory);
                                               installation[0].set("user", Parse.User.current());
                                            }
                                        }
                                    }else{
                                        if(installation[0].get("loginStatusOnDevice") != undefined){
                                            installation[0].set("loginStatusOnDevice", "logged out");
                                        }else{
                                            //on this device the user has never logged in 
                                        }
                                        
                                    }

                                    var lastLocation = installation[0].get("lastLocation");
                                    var locationHistory = installation[0].get("locationHistory");
                                    locationHistory.push(lastLocation);                                    
                                    installation[0].set("locationHistory", locationHistory);
                                    
                                    var locationObjectPromise = functions.getLocationObject();
                                    locationObjectPromise.then(function(locationObject){
                                        installation[0].set("lastLocation", locationObject);
                                        installation[0].save(null, {
                                            success: function(newInstallationRecord){
                                                console.log("Saved installation object for this device into database");
                                            },
                                            error: function(newInstallationRecord, error){
                                                console.log("Error: " + error.code + " " + error.message);
                                            }
                                        })
                                    }, function(error){
                                        console.log("Error: " + error.code + " " + error.message);
                                        installation[0].save(null, {
                                            success: function(newInstallationRecord){
                                                console.log("Saved installation object for this device into database");
                                            },
                                            error: function(newInstallationRecord, error){
                                                console.log("Error: " + error.code + " " + error.message);
                                            }
                                        })
                                    });
                                }
                            }, function(error){
                                console.log("Error: " + error.code + " " + error.message);
                            });
                            
                            

                          }, function(err){
                            console.log('error retrieving token: ' + err);
                          }
                        )
                    }
                }
            }
            return functions;
        }]);
