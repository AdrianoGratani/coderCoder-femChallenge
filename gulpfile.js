    // here is where you'll write all the config for Gulp;
// paste from https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbWZsSVJ3bTBSQmZSWEJvLXVvR2JCQlZIRzJOd3xBQ3Jtc0tsRVA3T2Zzbnd1SnVGdlptanRiZEctdC1fTUlqQ2tFZkpnM0JmY1NtT3FESlV2d3VkdU9wV3ZNeUdBaXpSNGZrdEl1QU1wZVlqQnJjNkVuNnRBdWNrem9NR3ZCcTJBaU1ZXzVCN0x6Nkg2QndTQUtWWQ&q=https%3A%2F%2Fgithub.com%2Fthecodercoder%2Ffem-dklt-toggle&v=krfUjg0S2uI

// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use
//sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'],
    series(scssTask, jsTask, browserSyncReload)
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask);