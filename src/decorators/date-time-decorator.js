angular.module('talker.decorators')
  .provider('tkDateTimeDecorator', function() {
    var format = 'shortTime';

    this.setFormat = function(value) {
      format = value;
    };

    this.$get = ['$filter', function($filter) {
      return function(message) {
        return ['['+$filter('date')(new Date(), format)+'] ' + message];
      };
    }];
  });