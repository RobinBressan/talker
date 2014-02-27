angular.module('talker.hooks')
  .provider('tkLocalStorageHook', function () {
    var storageKey = 'talker';

    this.setStorageKey = function (value) {
      storageKey = value;
    };

    this.$get = ['$window', function ($window) {
      if (!$window.localStorage) { return function() {}; }
      return function (message) {
        var json;
        try {
          json = JSON.parse($window.localStorage.getItem(storageKey));
          if (!json) { throw new Error(); }
        } catch (e) {
          json = [];
        }
        json.push(message);
        return $window.localStorage.setItem(storageKey, JSON.stringify(json));
      };
    }];
  });