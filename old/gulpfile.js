var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var pug = require('gulp-pug');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');


gulp.task('client_lib', function() {
  return gulp.src(['node_modules/socket.io-client/socket.io.js','node_modules/react/dist/react.js','node_modules/react-dom/dist/react-dom.js'])
    .pipe(gulp.dest('./public'));
});
gulp.task('less',function(){
  return gulp.src('src/client/style.less')
    .pipe(less())
    .pipe(gulp.dest('./public'));
});
gulp.task('server', function() {
  return gulp.src('src/server/*.js')
    .pipe(gulp.dest('./'));
});
gulp.task('templates', function() {
  return gulp.src('src/client/*.pug')
    .pipe(gulp.dest('./views'));
});
gulp.task('client', function() {
    return browserify({
      entries:['./src/client/main.js'],
      transform:[reactify],
      debug:true
    }).bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public'));
  });
gulp.task('clean',function(){
  return del(['views/*.pug','public/*.js','public/*.css','server.js','sio.js']);
});
gulp.task('build',['clean','client_lib','less','templates','client','server']);

gulp.task('watch',function(){
  gulp.watch(['src/server/*.js'],['server']);
  gulp.watch(['src/client/views/*.jsx','src/client/**.js'],['client']);
  gulp.watch(['src/client/*.less'],['less']);
  gulp.watch(['src/client/*.pug'],['templates']);
})
