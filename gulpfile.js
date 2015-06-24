var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint'),
    jshint_stylish = require('jshint-stylish');

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
    var LOCAL_SETTINGS = {};

    gulp.src('./jade/*.jade')
        .pipe(jade({
            locals: LOCAL_SETTINGS
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('images', function() {
    gulp.src('./images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function() {
    gulp.src(['./less/**/*.less'])
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
    return gulp.src('./js/**/*.js')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        // .pipe(jshint())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(jshint_stylish))
        .pipe(jshint.reporter('fail'))
        // .pipe(concat('application.js'))
        .pipe(gulp.dest('dist/js/'))
        //.pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('default', ['templates', 'scripts', 'images', 'styles', 'browser-sync'], function() {
    gulp.watch("./jade/**/*.jade", ['default']);
    gulp.watch("./less/**/*.less", ['styles', 'bs-reload']);
    gulp.watch("./js/**/*.js", ['scripts', 'bs-reload']);
    gulp.watch("*.html", ['bs-reload']);
});
