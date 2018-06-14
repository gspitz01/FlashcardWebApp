var app = angular.module('app', ['ngRoute', 'firebase']);

app.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(e, next, prev, err) {
    if (err === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      template: '<home flashcards="$resolve.flashcards" categories="$resolve.categories"></home>',
      resolve: {
        flashcards: function(fbRef, $firebaseArray, auth) {
          return auth.$requireSignIn().then(function() {
            return $firebaseArray(fbRef.getFlashcardsRef()).$loaded();
          });
        },
        categories: function(fbRef, $firebaseArray, auth) {
          return auth.$requireSignIn().then(function() {
            return $firebaseArray(fbRef.getCategoriesRef()).$loaded();
          });
        }
      }
    })
    .when('/categories', {
      template: '<category-list categories="$resolve.categories"></category-list>',
      resolve: {
        categories: function(fbRef, $firebaseArray, auth) {
          return auth.$requireSignIn().then(function() {
            return $firebaseArray(fbRef.getCategoriesRef()).$loaded();
          });
        }
      }
    })
    .when('/login', {
      template: '<login current-auth="$resolve.currentAuth"></login>',
      resolve: {
        currentAuth: function(auth) {
          return auth.$waitForSignIn();
        }
      }
    })
    .when('/logout', {
      template: '<logout></logout>'
    })
    .otherwise('/home');
});