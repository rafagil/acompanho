(function() {
  'use strict';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');

  var serviceFiles = './public/js/services/*.js';

  gulp.task('dist', function() {
    gulp.src(serviceFiles)
      .pipe(concat('./services'))
      .pipe(rename('services.js'))
      .pipe(gulp.dest('./dist'));

      gulp.src(serviceFiles)
        .pipe(concat('./services'))
        .pipe(rename('services.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
  });
  gulp.task('default', function() {
    gulp.run('dist');
    // gulp.watch(serviceFiles, function() {
    //   gulp.run('dist');
    // });
  });

}());
