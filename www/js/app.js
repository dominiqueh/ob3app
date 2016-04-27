// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var obApp = angular.module('starter', ['ionic', 'ngCordova', 'firebase']);
var fb = new Firebase("https://obapp.firebaseio.com/")

obApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
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
      url: "/secure",
      templateUrl: "templates/secure.html",
      controller: "SecureController"
    });
  $urlRouterProvider.otherwise("/firebase");
});

//login controller

obApp.controller("FirebaseController", function($scope, $state, $firebaseAuth) {
  var fbAuth = $firebaseAuth(fb)

  $scope.login = function(username, password) {
    fbAuth.$authWithPassword({
      email: username,
      password: password
    }).then(function(authData) {
      $state.go("secure")
    }).catch(function(error) {
      console.error("ERROR: " + error)
    })
  }
  $scope.register = function(username, password) {
    fbAuth.$createUser({
      email: username,
      password: password
    }).then(function(userData) {
      return fbAuth.$authWithPassword({
        email: username,
        password: password
      })
    }).then(function(authData) {
      $state.go("secure")
    }).catch(function(error) {
      console.error("ERROR: " + error)
    })
  }
})

//picture taking controller
//start copy below
obApp.controller("SecureController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera) {
  // clears history stack
  $ionicHistory.clearHistory()
  $scope.entries = []

  var fbAuth = fb.getAuth()
  if (fbAuth) {
    var userReference = fb.child("users/" + fbAuth.uid)
    var syncArray = $firebaseArray(userReference.child("entries"))
    console.error(syncArray)
    $scope.entries = syncArray
  } else {
    $state.go("firebase")
  }
  $scope.upload = function() {
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
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imageData = imageData
    }, function(error) {
      console.error("ERROR: " + error)
    })
  }
  $scope.addPerson = function(name) {
    alert("Adding entry", $scope.imageData, $scope.vName);
    syncArray.$add({
      image: $scope.imageData,
      name: name
    }).then(function(response) {
      alert("The Image Was Saved", response)
    })
  }
})
