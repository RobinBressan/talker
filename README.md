# Talker [![Build Status](https://travis-ci.org/RobinBressan/talker.png?branch=master)](https://travis-ci.org/RobinBressan/talker)

Enhance AngularJS logger. Talker adds hooks and decorating features to the logger and provides some (localStorage hook, HTTP hook, alert hook, datetime decorator).

Installation
------------

Install it with bower:

```
bower install talker --save
```

And include it :

```html
  <script src="bower_components/talker/talker-0.1.0.min.js"></script>
```

Usage
-----

First add the talker dependency to your application:

```javascript
angular.module('myApp', ['talker']);
```

That's all, the $log service has now three new methods : `before`, `after`, `decorate`.

Hooks
-----

Use `before` and `after` method to add a hook to the logger :

```javascript
$log.before(function(message) {
  // I'm triggered before $log receive the log
});
```

You can add a priority to it:

```javascript
$log.before(function(message) {
  // I'm triggered before $log receive the log
}, 999);
```
Hooks with higher priority are called first.

You can also specify a log type (info, log, warn, error, debug):

```javascript
$log.before('info', function(message) {
  // I'm triggered before $log.info receive the log
});
```

The after hook works the same:

```javascript
$log.after(function(message) {
  // I'm triggered after $log receive the log
});
```

Talker provides 3 hooks : `tkAlertHook`, `tkLocalStorageHook`, `tkHttpHook`. They are available in your application as services, and some are configurable with `config` :

```javascript
module('myApp', ['talker'])
  .config(['tkLocalStorageHookProvider', function (hook) {
    hook.setStorageKey('myStorage');  // Save data in json with myStorage as key
  }]);
```

```javascript
module('myApp', ['talker'])
  .config(['tkHttpHookProvider', function (hook) {
    hook.setThreshold(10); // Send POST after 10 logs received
    hook.setServer('localhost') // Send POST to localhost
  }]);
```

Decorators
----------

You can decorate a log using `decorate`:

```javascript
$log.decorate(function (message) {
  return ['Hey it is a log : ' + message]; // As to return an array
});
```

You can add a priority to it:

```javascript
$log.decorate(function (message) {
  return ['Hey it is a log : ' + message]; // As to return an array
}, 999);
```

Decorators with higher priority are called first.

Talker provides 1 decorator : `tkDateTimeDecorator`. It is available in your application as a service, and is configurable with `config` :

```javascript
module('myApp', ['talker'])
  .config(['tkDateTimeDecoratorProvider', function (decorator) {
    decorator.setFormat('shortTime'); // Change datetime format
  }]);
```

License
-------

This application is available under the MIT License.
