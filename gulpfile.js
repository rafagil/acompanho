(function() {
  'use strict';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var nodemon = require('gulp-nodemon');

  var paths = {
    servicesModule: './public/js/services/services.js',
    serviceFiles: './public/js/services/!(services)*.js'
  };

  gulp.task('dist', function() {
    gulp.src([paths.servicesModule, paths.serviceFiles])
      .pipe(concat('./services'))
      .pipe(rename('services.js'))
      .pipe(gulp.dest('./dist'));

      gulp.src([paths.servicesModule, paths.serviceFiles])
        .pipe(concat('./services'))
        .pipe(rename('services.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
  });

  gulp.task('serve', function() {
    nodemon({
      script: 'app.js',
      ext: 'js'
    }).on('restart', function() {
      console.log('Restarted.');
    });
  });

  gulp.task('default', ['dist']);

}());
