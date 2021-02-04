const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const scss = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const babel = require("gulp-babel");

const jsBuild = () => {
    return gulp.src('src/js/*.js')
      .pipe(plumber())
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
    )
      .pipe(uglify())
      .pipe(gulp.dest('build/js'))
};

const cssBuild = () => {
    return gulp.src('src/scss/pages/*.scss')
    .pipe(plumber())
    .pipe(scss({outputStyle: 'compressed'}).on("error", scss.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('build/css/'))
};

const watcher = () => {
    gulp.watch('src/scss/**/*.scss', gulp.series(cssBuild));
    gulp.watch('src/js/**/*.js', gulp.series(jsBuild));
};

exports.dev = gulp.series(watcher);

exports.production = gulp.series(jsBuild, cssBuild);