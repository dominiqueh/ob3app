// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var obApp = angular.module('starter', ['ionic', 'ngCordova', 'firebase']);


obApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

obApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("firebase", {
      url: "/firebase",
      templateUrl: "templates/firebase.html",
      controller: "FirebaseController",
      cache: false
    })
    .state("secure", {
      url:"/secure",
      templateUrl:"templates/secure.html",
      controller: "SecureController"
    });
    $urlRouterProvider.otherwise("/firebase");
});

//login controller

obApp.controller("FirebaseController", function($scope, $state, $firebaseAuth) {
  var fb = new Firebase("https://obapp.firebaseio.com/")

  $scope.login = function(username, password){
    fbAuth.$authWithPassword({
      email: usermame,
      password: password
    }).then(function(authData){
      $state.go("secure")
    }).catch(function(error){
      console.error("ERROR: " + error)
    })
  }
  $scope.register = function(username, password) {
    fbAuth.$createUser({email:username, password: password}).then(function(userData) {
      return fbAuth.$authWithPassword({
        email: username,
        password: password
      })
    }).then(function(authData){
      $state.go("secure")
    }).catch(function(error){
      console.error("ERROR: " + error)
    })
  }
})

//picture taking controller

obApp.controller("SecureController"), function($scope, $ionicHistory, $firebaseArray, $cordovaCamera){
// clears history stack
  $ionicHistory.clearHistory()
  $scope.images = []

  var fbAuth = fb.getAuth()
  if(fbAuth) {
    var userReference = fb.child("users/" + fbAuth.uid)
    var syncArray = $firebaseArray(userReference.child("images"))
    $scope.images = syncArray
  } else {
    $state.go("firebase")
  }
  $scope.upload = function(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture(options).then(function(imageData){
      syncArray.$add({image: imageData}).then(function() {
        alert("The Image Was Saved")
      })
    }, function(error){
      console.error("ERROR: " + error)
    })
  }
}
