var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer');

gulp.task('build-theme', function () {
    return gulp.src(['scss/bootstrap-*.scss', 'scss/toggle-*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: [__dirname] }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css/'))
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('copy-bootstrap-js', function () {
    return gulp
        .src(['node_modules/bootstrap/dist/js/*'])
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('copy-dist-to-razor-pages', function () {
    return gulp
        .src(['dist/**/*'])
        .pipe(gulp.dest('samples/razor-pages/wwwroot/'));
});
gulp.task('copy-dist-to-html', function () {
    return gulp
        .src(['dist/**/*'])
        .pipe(gulp.dest('samples/html/'));
});
gulp.task('copy-dist-to-samples', gulp.parallel(
    'copy-dist-to-razor-pages', 
    'copy-dist-to-html'
));


gulp.task('watch', gulp.series(gulp.parallel('copy-bootstrap-js', gulp.series('build-theme', 'copy-dist-to-samples')), function () {
    gulp.watch(['scss/*.scss'], gulp.series('build-theme', 'copy-dist-to-samples'));
}));

gulp.task('default', gulp.parallel('copy-bootstrap-js', gulp.series('build-theme', 'copy-dist-to-samples')));
