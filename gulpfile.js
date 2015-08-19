(function() {
  'use strict';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var nodemon = require('gulp-nodemon');
  var inject = require('gulp-inject');
  var mainBowerFiles = require('main-bower-files');

  var paths = {
    servicesModule: './public/js/services/services.js',
    serviceFiles: './public/js/services/!(services)*.js',
    mainModule: './public/js/main.js',
    appJs: './public/js/!(services)**/*.js',
    vendor: mainBowerFiles()
  };

  gulp.task('js', function() {
    gulp.src([paths.servicesModule, paths.serviceFiles])
      .pipe(concat('./services'))
      .pipe(rename('services.js'))
      .pipe(gulp.dest('./dist'));

    gulp.src([paths.servicesModule, paths.serviceFiles])
      .pipe(concat('./services'))
      .pipe(rename('services.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist'));

    gulp.src([paths.mainModule, paths.appJs])
      .pipe(concat('./acompanho'))
      .pipe(rename('acompanho.js'))
      .pipe(gulp.dest('./dist'));

    gulp.src([paths.mainModule, paths.appJs])
      .pipe(concat('./acompanho'))
      .pipe(rename('acompanho.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('inject-dev', function() {
    var target = gulp.src('./public/index.html');
    var vendor = gulp.src(paths.vendor);
    var sources = gulp.src([paths.servicesModule, paths.serviceFiles, paths.mainModule, paths.appJs], {
      read: false
    });
    return target.pipe(inject(sources, {
        addRootSlash: false,
        ignorePath: 'public'
      }))
      .pipe(inject(vendor, {
        name: 'vendor',
        addRootSlash: false,
        ignorePath: 'public'
      }))
      .pipe(gulp.dest('public'));
  });

  gulp.task('dist', ['js']);

  gulp.task('serve', ['inject-dev'], function() {
    nodemon({
      script: 'app.js',
      ignore: ['public/*'],
      ext: 'js'
    });
    gulp.watch('public/js/**/*.js', ['inject-dev']);
  });

  gulp.task('default', ['dist']);

}());
