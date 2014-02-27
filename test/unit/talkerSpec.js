describe('service', function() {
  var logger;
  var MethodProxy;

  beforeEach(module('talker'));

  beforeEach(inject(function($log, tkMethodProxy) {
    logger = $log;
    MethodProxy = tkMethodProxy;
  }));

  describe('talker', function() {
    it('should decorate $log service', function() {
      expect(typeof(logger.after)).toBe('function');
      expect(typeof(logger.before)).toBe('function');
      expect(typeof(logger.decorate)).toBe('function');
    });

    describe('methodProxy', function() {
      it('should call before/after callback at the right time', function() {
        var mainCalled = false;
        var beforeCalled = false;
        var afterCalled = false;

        var main = function() {
          mainCalled = true;
          expect(beforeCalled).toBe(true);
          expect(afterCalled).toBe(false);
        };

        var proxy = new MethodProxy(main);

        var beforeCallback = function() {
          beforeCalled = true;
        };

        var afterCallback = function() {
          afterCalled = true;
        };

        proxy.before(beforeCallback);
        proxy.after(afterCallback);
        proxy.call.apply(proxy);

        expect(afterCalled).toBe(true);
      });

      it('should respect before hook priority', function() {
        var beforeHigherCalled = false;
        var beforeLowerCalled = false;

        var main = function() {
        };

        var proxy = new MethodProxy(main);

        var beforeHigherCallback = function() {
          beforeHigherCalled = true;
          expect(beforeLowerCalled).toBe(false);
        };

        var beforeLowerCallback = function() {
          beforeLowerCalled = true;
          expect(beforeHigherCalled).toBe(true);
        };

        proxy.before(beforeHigherCallback, 1);
        proxy.before(beforeLowerCallback, 0);
        proxy.call.apply(proxy);

        expect(beforeLowerCalled).toBe(true);
      });

      it('should respect after hook priority', function() {
        var afterHigherCalled = false;
        var afterLowerCalled = false;

        var main = function() {
        };

        var proxy = new MethodProxy(main);

        var afterHigherCallback = function() {
          afterHigherCalled = true;
          expect(afterLowerCalled).toBe(false);
        };

        var afterLowerCallback = function() {
          afterLowerCalled = true;
          expect(afterHigherCalled).toBe(true);
        };

        proxy.after(afterHigherCallback, 1);
        proxy.after(afterLowerCallback, 0);
        proxy.call.apply(proxy);

        expect(afterLowerCalled).toBe(true);
      });
    });
  });
});
