var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var pug = require('gulp-pug');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');


gulp.task('default', ['watch']);

gulp.task('client_lib', function() {
    return gulp.src(['node_modules/socket.io-client/socket.io.js', 'node_modules/react/dist/react.js', 'node_modules/react-dom/dist/react-dom.js']).pipe(gulp.dest('./dist/lib'));
});
gulp.task('html', function() {
    return gulp.src(['./src/client/*.html']).pipe(gulp.dest('./dist')).pipe(browserSync.stream());
});
gulp.task('assets', function() {
    return gulp.src(['./src/client/assets/*.png']).pipe(gulp.dest('./dist')).pipe(browserSync.stream());
});
gulp.task('pug', function() {
    return gulp.src(['./src/client/*.pug']).pipe(pug()).pipe(gulp.dest('./dist')).pipe(browserSync.stream());
});
gulp.task('less', function() {
    return gulp.src('./src/client/*.less').pipe(less()).pipe(gulp.dest('./dist')).pipe(browserSync.stream());;
});
gulp.task('client', function() {
    return browserify({entries: ['./src/client/main.js'], transform: [reactify], debug: true}).bundle().pipe(source('main.js')).pipe(gulp.dest('./dist')).pipe(browserSync.stream());
});
gulp.task('server', function() {
    return gulp.src('src/server/*.js').pipe(gulp.dest('./'));
});
gulp.task('build-client', [
    'client_lib',
    'less',
    'html',
    'assets',
    'pug',
    'client'
]);
gulp.task('build', ['build-client', 'server']);

// Watch
gulp.task('watch', ['build'], function() {
    gulp.watch("./src/client/*.less", ['less']);
    gulp.watch("./src/client/*.html", ['html']);
    gulp.watch("./src/client/assets/*.png", ['assets']);
    gulp.watch("./src/client/*.pug", ['pug']);
    gulp.watch([
        "./src/client/*.js", "./src/client/views/*.jsx"
    ], ['client']);
    gulp.watch("./src/server/*.js", ['server']);

});



// Static Server
gulp.task('serve', ['build-client'], function() {

    browserSync.init({server: "./dist"});

    gulp.watch("./src/client/*.less", ['less']);
    gulp.watch("./src/client/*.html", ['html']);
    gulp.watch("./src/client/assets/*.png", ['assets']);
    gulp.watch("./src/client/*.pug", ['pug']);
    gulp.watch([
        "./src/client/*.js", "./src/client/views/*.jsx"
    ], ['client']);

});
