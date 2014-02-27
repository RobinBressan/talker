describe('service', function() {
  var logger;
  var window;

  beforeEach(module('talker'));

  beforeEach(inject(function($log, $window, tkLocalStorageHook) {
    logger = $log;
    logger.after(tkLocalStorageHook);
    window = $window;
    window.localStorage.removeItem('talker');
  }));

  describe('talker alert hook', function() {
    it('fill localStorage at each log', function() {
      expect(window.localStorage.getItem('talker')).toBe(null);
      logger.info('test');
      expect(JSON.parse(window.localStorage.getItem('talker'))).toEqual(['test']);
      logger.info('test2');
      expect(JSON.parse(window.localStorage.getItem('talker'))).toEqual(['test', 'test2']);
    });
  });
});
