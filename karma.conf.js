// Karma configuration

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',

        // frameworks to use
        frameworks: ['systemjs', 'jasmine-ajax', 'jasmine'],

        files: [
            'src/**/*.spec.js',
            'src/*.spec.js'
        ],

        systemjs: {
            configFile: 'system.config.js',
            serveFiles: [
                'bower_components/**/*.js',
                'src/**/*.js'
            ],
            config: {
                paths: {
                    'babel': 'node_modules/babel-core/browser.js',
                    'systemjs': 'node_modules/systemjs/dist/system.js',
                    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
                    'phantomjs-polyfill': 'node_modules/phantomjs-polyfill/bind-polyfill.js',
                    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
                },
                transpiler: 'babel'
            }
        },

        // list of files to exclude
        exclude: [],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/!(*spec).js': ['coverage']
        },

        coverageReporter: {
            type: 'lcovonly',
            dir: 'reporters',
            subdir: '.',
            instrumenters: {isparta: require('isparta')},
            instrumenter: {
                '**/*.js': 'isparta'
            },
            reporters: [
                // reporters not supporting the `file` property
                {type: 'lcov', subdir: 'report-lcov'}
            ]
        },


        junitReporter: {
            outputFile: 'reporters/junit.xml'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
