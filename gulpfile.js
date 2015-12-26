var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    Server = require('karma').Server;

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
gulp.task('lint', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})
