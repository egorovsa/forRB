var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var ngmin = require('gulp-ngmin');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var connect = require('gulp-connect');
var notify = require("gulp-notify");
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var embedTemplates = require('gulp-angular-embed-templates');
var templateCache = require('gulp-angular-templatecache');

//connect
gulp.task('connect', function () {
    connect.server({
        root: 'public/app',
        livereload: true
    });
});

//html
gulp.task('html', function () {
    gulp.src('public/src/*.html')
            .pipe(replace('js/modules', 'js/common/modules'))
            .pipe(replace('js/app', 'js/common/app'))
            .pipe(gulp.dest('public/app/'))
            //.pipe(notify('JS task is done'))
            .pipe(connect.reload());
});

//css
gulp.task('css', function () {
    gulp.src('public/app/css/main.css')
            //.pipe(sass().on('error', sass.logError))
            .pipe(concatCss('bundle.css'))
            .pipe(minifyCss(''))
            .pipe(rename('bundle.min.css'))
            .pipe(gulp.dest('public/app/css/'))
            //.pipe(notify('CSS task is done'))
            .pipe(connect.reload());
});

//sass
gulp.task('sass', function () {
    gulp.src('public/src/sass/*.scss')
            //.pipe(concat('public/src/sass/main.scss'))
            .pipe(sass().on('error', sass.logError))
//            .pipe(autoprefixer())
            .pipe(minifyCss(''))
            .pipe(rename({
                suffix: ".min"
            }))
            //.pipe(rename('bundle.min.css'))
            .pipe(gulp.dest('public/app/css'))
            .pipe(connect.reload());
});


//js
gulp.task('js', function () {
    gulp.src('public/src/js/*.js')
            .pipe(embedTemplates())
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest('public/app/js/common/'));
    gulp.src('public/src/js/vendors/{,*/}*.js')
            .pipe(gulp.dest('public/app/js/vendors/'))
            .pipe(connect.reload());
});

//modules
gulp.task('modules', function () {
    return gulp.src('public/src/js/modules/{,*/}*.js')
            .pipe(embedTemplates())
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest('public/app/js/common/modules/'))
            .pipe(connect.reload());
});


//watch
gulp.task('watch', function () {
    gulp.watch('public/src/*.html', ['html']);
    gulp.watch('public/src/sass/{,*/*/}*.scss', ['sass']);
    gulp.watch('public/src/js/*.js', ['js']);
    gulp.watch('public/src/js/modules/{,*/}*', ['modules']);
    gulp.watch('public/src/templates/*.html', ['js', 'modules']);
});

gulp.task('buildSrc', ['html', 'js', 'modules', 'sass']);

gulp.task('default', ['connect', 'watch']);
