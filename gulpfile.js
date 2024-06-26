const gulp = require('gulp');
const postcss = require('gulp-postcss');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const projects = require('./src/blocks/portfolio/projects');

const isDevelopment = process.env.NODE_ENV !== 'production';

gulp.task('views', function buildHTML() {
  return gulp.src('./src/index.pug')
    .pipe(pug({
      data: {
        projects
      }
    }))
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    })
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
  return gulp.src('./src/app.styl')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylus({
      'include css': true
    })
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    }))
    .pipe(gulpIf(!isDevelopment, postcss([
      autoprefixer()
    ])))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, cleanCSS()))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts', function() {
  return browserify({
    entries: './src/app.js',
    debug: isDevelopment
  })
    .transform(babelify, { presets: [ '@babel/preset-env' ] })
    .bundle()
    .on('error', function (error) {
      gutil.log(gutil.colors.red('Error: ' + error), '\n', error.codeFrame);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpIf(!isDevelopment, uglify()))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('fonts', function () {
  return gulp.src([
    './node_modules/font-awesome/fonts/**/*.*'
  ])
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('images', function () {
  return gulp.src('./src/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin())
    .pipe(rename(function (path) {
      path.dirname = '';
    }))
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy:public', function () {
  return gulp.src('./public/**/*.*')
    .pipe(gulp.dest('./dist/public'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.pug', gulp.series('views'));
  gulp.watch('./src/**/*.{css,styl}', gulp.series('styles'));
  gulp.watch('./src/**/*.js', gulp.series('scripts'));
  gulp.watch('.public', gulp.series('copy:public'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: './dist',
    port: 8080
  });

  browserSync.watch('./dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return del('./dist')
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'views',
    'styles',
    'scripts',
    'fonts',
    'images',
    'copy:public'
  )));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'serve'
  ))
);

