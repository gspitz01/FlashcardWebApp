angular.module('app').component('logout', {
  controller: function(auth, $location, $timeout) {
    auth.$signOut();
    
    $timeout(function() {
      $location.path('/login');
    }, 500);
  }
});