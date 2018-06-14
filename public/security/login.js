angular.module('app').component('login', {
  templateUrl: '/security/login.html',
  bindings: {
    currentAuth: '='
  },
  controller: function(auth, $location) {
    this.loggedIn = !!this.currentAuth;
    this.anonLogin = function() {
      auth.$signInAnonymously().then(function() {
        $location.path('/home');
      }).catch((function(err) {
        this.errorMessage = err.code;
      }).bind(this));
    };
    
    this.oAuthLogin = function() {
      auth.$signInWithPopup().then(function() {
        $location.path('/home');
      }).catch((function(err) {
        this.errorMessage = err.code;
      }).bind(this));
    };
  }
});