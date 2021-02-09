const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const scss = require("gulp-sass");
const uglify = require("gulp-uglify-es").default;
const babel = require("gulp-babel");

// jsBuild - оптимизация / копирование используемых js файлов для разработки
const jsBuild = () => {
  return gulp
    .src("src/js/*.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/env"],
      }),
    )
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
};

const jsLibsCopy = () => {
  return gulp.src("src/js/libs").pipe(plumber()).pipe(gulp.dest("build/js"));
};

// cssBuild - обработка / оптимизация / копирование используемых scss файлов для разработки
const cssBuild = () => {
  return gulp
    .src("src/scss/pages/*.scss")
    .pipe(plumber())
    .pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gulp.dest("build/css/"));
};

const cssLibsCopy = () => {
  return gulp.src("src/scss/libs").pipe(plumber()).pipe(gulp.dest("build/css"));
};

// watch - определяем наблюдаемые типы файлов и функции для выполнения при изменении файла
const watcher = () => {
  gulp.watch("src/scss/**/*.scss", gulp.series(cssBuild));
  gulp.watch("src/js/**/*.js", gulp.series(jsBuild));
  gulp.watch("src/scss/libs/**/*.*", gulp.series(cssLibsCopy));
  gulp.watch("src/js/libs/**/*.*", gulp.series(jsLibsCopy));
};

// экспортируем команду обработчика dev
exports.dev = gulp.series(watcher);
// экспортиируем команду обработчика production
exports.production = gulp.series(jsBuild, cssBuild);
