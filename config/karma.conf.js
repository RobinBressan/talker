module.exports = function(config){
    config.set({
      basePath : '../',

      files : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'src/*.js',
        'src/**/*.js',
        'test/unit/**/*.js'
      ],

      exclude : [
        'app/lib/angular/angular-loader.js',
        'app/lib/angular/*.min.js',
        'app/lib/angular/angular-scenario.js'
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
