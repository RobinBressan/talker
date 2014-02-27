describe('service', function() {
  var logger;
  var window;

  beforeEach(module('talker'));

  beforeEach(inject(function($log, $window, tkAlertHook) {
    logger = $log;
    logger.after(tkAlertHook);

    window = $window;
    spyOn(window, 'alert');
  }));

  describe('talker alert hook', function() {
    it('trigger alert at each log', function() {
      logger.info('test');
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
