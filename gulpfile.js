var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    shell = require('gulp-shell'),
    util = require('gulp-util'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps');


var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var drupal_root = '/Users/huangr/git_repos/nyu-law-d8/web';
var drupal_theme_path = drupal_root + '/themes/custom/nyulaw';

// need change
var pantheon_root = '/Users/ray/git_repos/nyu-law-pantheon';
var rsync_options = "--archive --compress --progress --verbose --stats --exclude='.svn*' --exclude='gulp*' --exclude='node_modules*' --exclude='grunttask*' --exclude='.git' ";

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
gulp.task('sass', function() {
    return gulp.src('scss/styles.scss')
        .pipe(sass())
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * @task clearcache
 * Clear all caches
 */
gulp.task('clearcache', shell.task([
    'fin drush cr'
], {
    cwd: drupal_root,
    verbose: true
}));

/**
 * @task reload
 * Refresh the page after clearing cache
 */
gulp.task('reload', ['clearcache'], function() {
    browserSync.reload();
});

/**
 * @task watch
 * Watch scss files for changes & recompile
 * Clear cache when Drupal related files are changed
 */
gulp.task('watch', function() {
    // gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass']);
    // gulp.watch('**/*.{php,inc,info}',['reload']);
    gulp.watch(drupal_root + "/themes/custom/nyulaw/less/*", ['reload']);
});

/**
 * Default task, running just `gulp` will
 * compile Sass files, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);






gulp.task('less', function(){
  return gulp.src(drupal_theme_path + '/less/style.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(drupal_theme_path + '/css'));
});


/** Watch less files changed and invoke drush cc less */
gulp.task('watch-less', function() {
    gulp.watch(
        [
          drupal_theme_path + "/less/*",
        ], ['rmcss','less']);
});

gulp.task('rmcss', shell.task([
  'rm -f ' + drupal_theme_path + '/css/*',
]));


gulp.task('styleguide-kss', shell.task([
  'rm -f ' + drupal_theme_path + '/styleguide/css/style.css',
  'npm-run kss --config kss-config.json'
]));

/**
 * Sync responsive theme to pantheon.
 *
 * This take care of git push and drush cc all.
 *
 * @type {[type]}
 */
gulp.task('pantheon-responsive-sync', shell.task([
    'git checkout responsive',
    'rsync ' + rsync_options + drupal_root + '/sites/all/themes/nyulaw_responsive/ ' + pantheon_root + '/sites/all/themes/nyulaw_responsive/',
    'git commit -am "Sync from dev."',
    'git push origin responsive',
    'drush @pantheon.nyu-law-school.responsive cc all'

], {
    cwd: pantheon_root,
    verbose: true,
    env: {
        PATH: process.env.PATH
    }
}));
