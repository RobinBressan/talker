describe('service', function() {
  var logger;
  var filter;

  beforeEach(module('talker'));

  beforeEach(inject(function($log, $filter, tkDateTimeDecorator) {
    logger = $log;
    filter = $filter;
    logger.decorate(tkDateTimeDecorator);
  }));

  describe('talker datetime decorator', function() {
    it('add datetime to each log', function() {
      logger.after(function(message) {
        expect(message).toBe('['+filter('date')(new Date(), 'shortTime')+'] test');
      });
      logger.info('test');
    });
  });
});
