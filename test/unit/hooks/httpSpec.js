describe('service', function() {
  var logger;
  var httpBackend;

  beforeEach(module('talker'));

  beforeEach(inject(function($log, $httpBackend, tkHttpHook) {
    logger = $log;
    httpBackend = $httpBackend;
    logger.after(tkHttpHook);
  }));

  describe('talker http hook', function() {
    it('emit at each 5 logs', function() {
      httpBackend.expectPOST('localhost', { data: ['Test0', 'Test1', 'Test2', 'Test3', 'Test4'] }).respond();
      for (var i=0; i<5; i++) {
        logger.info('Test'+i);
      }
      httpBackend.flush();
    });
  });
});
