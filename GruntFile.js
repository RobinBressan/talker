module.exports = function (grunt) {
    // * Read command-line switches
    // - Read in --browsers CLI option; split it on commas into an array if it's a string, otherwise ignore it
    var browsers = typeof grunt.option('browsers') == 'string' ? grunt.option('browsers').split(',') : undefined;

    var stripBanner = function (src, options) {

        if (!options) { options = {}; }
        var m = [];
        if (options.line) {
            // Strip // ... leading banners.
            m.push('(/{2,}[\\s\\S].*)');
        }
        if (options.block) {
            // Strips all /* ... */ block comment banners.
            m.push('(\/+\\*+[\\s\\S]*?\\*\\/+)');
        } else {
            // Strips only /* ... */ block comment banners, excluding /*! ... */.
            m.push('(\/+\\*+[^!][\\s\\S]*?\\*\\/+)');

        }
        var re = new RegExp('\s*(' + m.join('|') + ')\s*', 'g');
        src = src.replace(re, '');
        src = src.replace(/\s{2,}(\r|\n|\s){2,}$/gm, '');
        src = src.replace(/"use strict";/, '');
        return src;
    };

    grunt.registerMultiTask('concat', 'Concatenate files.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            separator: grunt.util.linefeed,
            banner: '',
            footer: '',
            stripBanners: false,
            process: false
        });
        // Normalize boolean options that accept options objects.
        if (typeof options.stripBanners === 'boolean' && options.stripBanners === true) { options.stripBanners = {}; }
        if (typeof options.process === 'boolean' && options.process === true) { options.process = {}; }

        // Process banner and footer.
        var banner = grunt.template.process(options.banner);
        var footer = grunt.template.process(options.footer);

        // Iterate over all src-dest file pairs.
        this.files.forEach(function (f) {
            // Concat banner + specified files + footer.
            var src = banner + f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                var src = grunt.file.read(filepath);
                // Process files as templates if requested.
                if (options.process) {
                    src = grunt.template.process(src, options.process);
                }
                // Strip banners if requested.
                if (options.stripBanners) {
                    src = stripBanner(src, options.stripBanners);
                }
                return src;
            }).join(grunt.util.normalizelf(options.separator)) + footer;

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        srcFiles: [
            'src/*.js',
            'src/**/*.js'
        ],
        testFiles: { //unit & e2e goes here
            karmaUnit: 'config/karma.conf.js'
        },
        karma: {
            unit: {
                options: {
                    configFile: '<%= testFiles.karmaUnit %>',
                    autoWatch: false,
                    singleRun: true,
                    browsers: browsers || ['Chrome']
                },
            },
            watch: {
                options: {
                    configFile: '<%= testFiles.karmaUnit %>',
                    autoWatch: false,
                    browsers: browsers || ['Chrome']
                },
                background: true
            },
            ci: {
                options: {
                    configFile: '<%= testFiles.karmaUnit %>',
                    autoWatch: false,
                    singleRun: true,
                    browsers: browsers || ['PhantomJS']
                },
            }
        },
        watch: {
            // Run unit test with karma
            karma: {
                files: ['build/talker.debug.js', 'test/unit/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:watch:run']
            },
            // Auto-build ng-grid.debug.js when source files change
            debug: {
                files: ['<%= srcFiles %>'],
                tasks: ['debug']
            },
        },
        concat: {
            options: {
                banner: '/***********************************************\n' +
                    '* Talker JavaScript Library\n' +
                    '* Authors: https://github.com/robinbressan/talker/blob/master/README.md \n' +
                    '* License: MIT (http://www.opensource.org/licenses/mit-license.php)\n' +
                    '* Compiled At: <%= grunt.template.today("mm/dd/yyyy HH:MM") %>\n' +
                    '***********************************************/\n' +
                    '(function() {\n' +
                    '\'use strict\';\n',
                footer: '\n}());'
            },
            prod: {
                options: {
                    stripBanners: {
                        block: true,
                        line: true
                    }
                },
                src: ['<%= srcFiles %>'],
                dest: 'build/<%= pkg.name %>.js'
            },
            debug: {
                src: ['<%= srcFiles %>'],
                dest: 'build/<%= pkg.name %>.debug.js'
            },
            version: {
                src: ['<%= srcFiles %>'],
                dest: '<%= pkg.name %>-<%= pkg.version %>.debug.js'
            }
        },
        uglify: {
            options: {
              mangle: false
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            },
            version: {
                src: '<%= pkg.name %>-<%= pkg.version %>.debug.js',
                dest: '<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        jshint: {
            options: {
                boss: true,
                browser: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                // forin: true,
                immed: true,
                // indent: 4,
                latedef: true,
                // newcap: true,
                noarg: true,
                sub: true,
                // undef: true,
                // unused: true,
                globals: {
                    angular: false,
                    $: false
                }
            },
            src: [ 'src/*.js', 'src/**/*.js' ],
            spec: {
                options: {
                    camelcase: false,
                    globals: {
                        $: false,
                        angular: false,
                        beforeEach: false,
                        browser: false,
                        browserTrigger: false,
                        describe: false,
                        expect: false,
                        inject: false,
                        input: false,
                        it: false,
                        module: false,
                        repeater: false,
                        runs: false,
                        spyOn: false,
                        waits: false,
                        waitsFor: false
                    }
                },
                files: {
                    spec: ['test/*.js', 'test/**/*.js']
                },
            }
        }
    });

    // Load grunt-karma task plugin
    grunt.loadNpmTasks('grunt-karma');
    // Load the grunt-contrib-watch plugin for doing file watches
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint', 'karma:unit']);

    grunt.registerTask('testwatch', ['jshint', 'karma:watch', 'watch']);

    grunt.registerTask('test-ci', ['jshint', 'debug', 'karma:ci']);

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Old default task
    grunt.registerTask('build', ['concat', 'uglify']);

    // Default task(s).
    grunt.registerTask('default', 'No default task', function() {
        grunt.log.write('The old default task has been moved to "build" to prevent accidental triggering');
    });

    grunt.registerTask('debug', ['concat:debug']);
    grunt.registerTask('prod', ['concat:prod', 'uglify']);
    grunt.registerTask('version', ['concat:version', 'uglify:version']);
};