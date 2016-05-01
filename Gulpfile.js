'use strict'
let gulp = require('gulp');
let minify = require('gulp-minify');
let uglify = require('gulp-uglify');

gulp.task('dist',()=>{
  gulp.src('./public/js/*.js')
  .pipe(uglify())
  .pipe(minify())
  .pipe(gulp.dest('./public/dist'));
});

gulp.task('default',['dist']);
