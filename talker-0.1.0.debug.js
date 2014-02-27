/***********************************************
* Talker JavaScript Library
* Authors: https://github.com/RobinBressan/talker/blob/master/README.md 
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 02/27/2014 22:18
***********************************************/
(function() {
'use strict';
angular.module('talker.services', []);
angular.module('talker.decorators', []);
angular.module('talker.hooks', []);
angular.module('talker', ['talker.services', 'talker.decorators', 'talker.hooks']);
angular.module('talker')
  .config(function($provide) {
    $provide.decorator('$log', ['$delegate', 'tkMethodProxy', function($delegate, MethodProxy) {
      var wrappers = {
        'info': new MethodProxy($delegate.info),
        'log' : new MethodProxy($delegate.log),
        'warn': new MethodProxy($delegate.warn),
        'error': new MethodProxy($delegate.error),
        'debug': new MethodProxy($delegate.debug),
      };

      var callbackBuilder = function(type) {
        return function() {
            return wrappers[type].call.apply(wrappers[type], arguments);
          };
      };

      $delegate.info  = callbackBuilder('info');
      $delegate.log   = callbackBuilder('log');
      $delegate.warn  = callbackBuilder('warn');
      $delegate.error = callbackBuilder('error');
      $delegate.debug = callbackBuilder('debug');

      var appendCallbackToAll = function(method, callback, priority) {
        angular.forEach(wrappers, function (wrapper) {
          wrapper[method].apply(wrapper, [callback, priority]);
        });
      };

      $delegate.before = function(type, callback, priority) {
        if (typeof(type) === 'function') {  // If no type specified, apply it to all
          return appendCallbackToAll('before', type, callback);
        }
        wrappers[type].before.apply(wrappers[type], [callback,priority]);
      };
      $delegate.after = function(type, callback, priority) {
        if (typeof(type) === 'function') {  // If no type specified, apply it to all
          return appendCallbackToAll('after', type, callback);
        }
        wrappers[type].after.apply(wrappers[type], [callback, priority]);
      };
      $delegate.decorate = function(type, callback, priority) {
        if (typeof(type) === 'function') {  // If no type specified, apply it to all
          return appendCallbackToAll('decorate', type, callback);
        }
        wrappers[type].decorate.apply(wrappers[type], [callback, priority]);
      };

      return $delegate;
    }]);
  });

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
angular.module('talker.hooks')
  .provider('tkAlertHook', function() {
    this.$get = ['$window', function($window) {
      return function(message) {
        $window.alert(message);
      };
    }];
  });
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
angular.module('talker.services')
  .factory('tkMethodProxy', function () {
    var MethodProxy = function MethodProxy(_callback) {
      this._callback = _callback;
      this._preCallbacks = [];
      this._postCallbacks = [];
      this._decoratorCallbacks = [];
    };

    MethodProxy.prototype.before = function(preCallback, priority) {
      if (!priority || ~~priority !== priority) { priority = 0; }
      this._preCallbacks.push({
        callback: preCallback,
        priority: priority
      });
    };

    MethodProxy.prototype.after = function(postCallback, priority) {
      if (!priority || ~~priority !== priority) { priority = 0; }
      this._postCallbacks.push({
        callback: postCallback,
        priority: priority
      });
    };

    MethodProxy.prototype.decorate = function(decoratorCallback, priority) {
      if (!priority || ~~priority !== priority) { priority = 0; }
      this._decoratorCallbacks.push({
        callback: decoratorCallback,
        priority: priority
      });
    };

    MethodProxy.prototype.call = function() {

      var sortByPriority = function (a, b) {
        return a.priority < b.priority; // DESC
      };

      this._preCallbacks.sort(sortByPriority);
      this._postCallbacks.sort(sortByPriority);

      var args = arguments;
      var result = null;

      try {
        angular.forEach(this._preCallbacks, function(preCallback) {
          preCallback.callback.apply(this, args);
        });

        angular.forEach(this._decoratorCallbacks, function(decoratorCallback) {
          args = decoratorCallback.callback.apply(this, args);
        });

        try {
          result = this._callback.apply(this, args); // We do not depend on potential errors of main callback
        } catch (e) {
          result = e;
        }

        angular.forEach(this._postCallbacks, function(postCallback) {
          postCallback.callback.apply(this, args);
        });
      } catch (e) {
        result = e;
      }
      return result;
    };

    return MethodProxy;
  });

}());