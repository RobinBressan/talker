angular.module('talker.hooks')
  .provider('tkAlertHook', function() {
    this.$get = ['$window', function($window) {
      return function(message) {
        $window.alert(message);
      };
    }];
  });