angular.module('talker.hooks')
  .provider('tkHttpHook', function () {
    var server = 'localhost';

    this.setServer = function(value) {
      server = value;
    };

    var threshold = 5;

    this.setThreshold = function(value) {
      threshold = value;
    };

    this.$get = ['$http', function($http) {
      var accumulator = [];

      return function(message) {
        accumulator.push(message);

        if (accumulator.length === threshold) {
          $http.post(server, { data: accumulator })
          .success(function() {
            accumulator = [];
          });
        }
      };
    }];
  });