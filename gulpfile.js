var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');

var minifycss = require('gulp-minify-css');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function() {
    browserSync.reload();
});

gulp.task('templates', function() {
    var YOUR_LOCALS = {};

    gulp.src('./jade/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('./templates/'))
});

gulp.task('images', function() {
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function() {
    gulp.src(['src/css/**/*.less'])
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(less())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch("src/css/**/*.less", ['styles']);
    gulp.watch("src/js/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});
