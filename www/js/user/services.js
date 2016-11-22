angular.module('user.services', [])

    .service('UserService', ['$q', 'ParseConfiguration',
        function ($q, ParseConfiguration) {

            var parseInitialized = false;


            return {

                currentUserObject: null,
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
                    return user.signUp(null, {});

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
                    this.currentUser = currentUser;
                },
                getCurrentUser: function(){
                    //console.log("getCurrentUser : " + JSON.stringify(this.currentUserObject));
                    return this.currentUserObject;
                },
                uploadFile: function(_imageObject){
                    
                    _imageObject.ext = /[^/]*$/.exec(_imageObject.src.match(/[^;]*/)[0])[0];

                    var parseFile = new Parse.File( Parse.User.current().id +"_"+ _imageObject.ext, { base64: _imageObject.src });
                    Parse.User.current().get("information").set("profilePhoto", parseFile);
                    return Parse.User.current().save(null, {
                        success: function(user){
                            //return $q.when(user);
                        },
                        error: function(user, error){
                           //return $q.reject({error: error});
                        }
                    });
                }
            }
        }]);
