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
