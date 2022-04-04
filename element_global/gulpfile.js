const { task, watch, series, parallel, src, dest } = require('gulp');

const browserSync = require('browser-sync');
const del = require('del');
const pug = require('gulp-pug');
const typograf = require('gulp-typograf');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const favicons = require('gulp-favicons');

const server = browserSync.create();

const paths = {
  views: {
    src:   [`./src/views/**/*.pug`, `!./src/views/blocks/*.pug`, `!./src/views/layouts/*.pug`],
    watch: [`./src/views/**/*`],
    build:  `./build/`
  },
  styles: {
    src:   [`./src/assets/styles/**/*.scss`],
    watch: [`./src/assets/styles/**/*`],
    build:  `./build/assets/styles/`
  },
  favicons: {
    src:   [`./src/assets/favicons/*.{jpg,jpeg,png,gif}`],
    build:  `./build/assets/favicons/`
  },
  other: {
    src: [
      `./src/**/*`,
      `!./src/views/**`,
      `!./src/assets/styles/**`, 
      `!./src/assets/favicons/**`, 
      `!./src/locales/**`,
    ],
    build: `./build/`
  },
  locales: `./src/locales/*.json`,
}

task('views', function() {
  return src(paths.views.src)
    .pipe(pug({ pretty: true }))
    .pipe(typograf({ locale: ['ru'] }))
    .pipe(dest(paths.views.build))
});

task('styles', function() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/maps/'))
    .pipe(dest(paths.styles.build))
});

task('favicons', function () {
  return src(paths.favicons.src)
    .pipe(
      favicons({
        path: 'assets/favicons/',
        html: 'index.html',
        pipeHTML: true,
        icons: {
          favicons: true,
          android: false, 
          appleIcon: false,
          appleStartup: false,
          windows: false,
          yandex: false,
        }
      })
    )
    .pipe(dest(paths.favicons.build))
});

task('other', function () {
  return src(paths.other.src)
    .pipe(dest(paths.other.build))
});

function clean(done) {
  del.sync(['build']);
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: `./build/`
    }
  });

  watch(paths.views.watch, series('views', reload));
  watch(paths.styles.watch, series('styles', reload));
  watch(paths.other.src, series('other', reload));
  
  done();
}

function reload(done) {
  server.reload();
  done();
}

task("default", 
  series(
    clean,
    parallel('views', 'styles', 'favicons', 'other'),
    serve
  )
);