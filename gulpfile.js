(function() {
  'use strict';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var nodemon = require('gulp-nodemon');
  var inject = require('gulp-inject');
  var mainBowerFiles = require('main-bower-files');
  var filter = require('gulp-filter');

  var scriptFilter = '**/*.js';

  var paths = {
    servicesModule: './public/js/services/services.js',
    serviceFiles: './public/js/services/!(services)*.js',
    mainModule: './public/js/main.js',
    appJs: './public/js/!(services|min)**/*.js',
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


  gulp.task('inject-prod', function() {
    var target = gulp.src('./public/index.html');
    var vendor = gulp.src(paths.vendor);
    var sources = gulp.src([paths.servicesModule, paths.serviceFiles, paths.mainModule, paths.appJs]);

    return target.pipe(inject(
        sources.pipe(concat('./app'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/min')), {
          addRootSlash: false,
          ignorePath: 'public'
        }))
      .pipe(inject(vendor.pipe(filter(scriptFilter))
        .pipe(concat('./vendor'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/min')), {
          name: 'vendor',
          addRootSlash: false,
          ignorePath: 'public'
        }))
      .pipe(gulp.dest('public'));
  });

  gulp.task('dist', ['js', 'inject-prod']);

  gulp.task('serve', ['inject-dev'], function() {
    nodemon({
      script: 'server.js',
      ignore: ['public/*'],
      ext: 'js'
    });
    gulp.watch('public/js/**/*.js', ['inject-dev']);
  });

  gulp.task('default', ['dist']);

}());
