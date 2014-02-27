module.exports = function(config){
    config.set({
      basePath : '../',

      files : [
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'src/*.js',
        'src/**/*.js',
        'test/unit/**/*.js'
      ],

      autoWatch : false,
      singleRun: true,

      frameworks: ['jasmine'],

      browsers : ['PhantomJS'],

      plugins : [
              'karma-junit-reporter',
              'karma-phantomjs-launcher',
              'karma-jasmine'
              ],

      junitReporter : {
        outputFile: 'test_out/unit.xml',
        suite: 'unit'
      }
  });
};
