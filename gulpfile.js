var gulp        = require('gulp'),
browserSync = require('browser-sync'),
sass        = require('gulp-sass'),
prefix      = require('gulp-autoprefixer'),
shell       = require('gulp-shell');
util        = require('gulp-util');


var drupal_root = '/git_repos/drupal';

/**
* Launch the Server
*/
gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        // Change as required
        proxy: "localhost:8888",
        socket: {
            // For local development only use the default Browsersync local URL.
            //domain: 'localhost:3000'
            // For external development (e.g on a mobile or tablet) use an external URL.
            // You will need to update this to whatever BS tells you is the external URL when you run Gulp.
            //domain: '192.168.0.13:3000'
            domain: 'localhost:3000'
        }
    });
});

/**
* @task sass
* Compile files from scss
*/
gulp.task('sass', function () {
    return gulp.src('scss/styles.scss')
    .pipe(sass())
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({stream:true}))
});

/**
* @task clearcache
* Clear all caches
*/
gulp.task('clearcache', function() {
    return shell.task([
        'drush cc all'
    ]);
});

/**
* @task reload
* Refresh the page after clearing cache
*/
gulp.task('reload', ['clearcache'], function () {
    browserSync.reload();
});

/**
* @task watch
* Watch scss files for changes & recompile
* Clear cache when Drupal related files are changed
*/
gulp.task('watch', function () {
    // gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass']);
    // gulp.watch('**/*.{php,inc,info}',['reload']);
    gulp.watch(drupal_root+"/sites/all/themes/nyulaw/**/*",['reload'])
});

/**
* Default task, running just `gulp` will
* compile Sass files, launch BrowserSync & watch files.
*/
gulp.task('default', ['browser-sync', 'watch']);
