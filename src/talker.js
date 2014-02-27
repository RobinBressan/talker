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
