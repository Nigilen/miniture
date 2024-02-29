const gulp = require('gulp');
const concat = require('gulp-concat-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));


function pug() {
  return gulp.src('src/pages/**/*.pug')
    .pipe(gulpPug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}


function layoutsScss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];
  return gulp.src('src/layouts/default.scss')
    .pipe(sass())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function pagesScss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];
  return gulp.src('src/pages/**/*.scss')
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/assets/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(browserSync.reload({stream: true}))
}

function fonts() {
  return gulp.src('src/assets/fonts/**/*.{woff, woff2}')
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(browserSync.reload({stream: true}))
}

function icons() {
  return gulp.src('src/assets/icons/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/assets/icons'))
    .pipe(browserSync.reload({stream: true}))
}

function clean() {
  return del('dist')
}

function watchFiles() {
  gulp.watch(['src/pages/*.pug'], pug);
  gulp.watch(['src/pages/*.scss'], pagesScss);
  gulp.watch(['src/layout/*.scss'], layoutsScss);
  gulp.watch(['src/assets/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/assets/fonts/**/*.{woff, woff2}'], fonts);
  gulp.watch(['src/assets/icons/**/*.{jpg,png,svg,gif,ico,webp,avif}'], icons);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(pug, layoutsScss, pagesScss, images, fonts, icons));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.pug = pug;
exports.images = images;
exports.icons = icons;
exports.fonts = fonts;
exports.clean = clean;
exports.default = watchapp;
exports.build = build;