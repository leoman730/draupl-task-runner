// var gulp = require('gulp'),
//     browserSync = require('browser-sync'),
//     // sass = require('gulp-sass'),
//     prefix = require('gulp-autoprefixer'),
//     shell = require('gulp-shell'),
//     util = require('gulp-util'),
//     less = require('gulp-less'),
//     sourcemaps = require('gulp-sourcemaps'),
//     lessWatcher = require('gulp-less-watcher');

// var LessAutoprefix = require('less-plugin-autoprefix');
// var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var drupal_root = '/Users/huangr/git_repos/nyu-law-d8/web';
var drupal_theme_path = drupal_root + '/themes/custom/nyulaw';

// need change
var pantheon_root = '/Users/ray/git_repos/nyu-law-pantheon';
var rsync_options = "--archive --compress --progress --verbose --stats --exclude='.svn*' --exclude='gulp*' --exclude='node_modules*' --exclude='grunttask*' --exclude='.git' ";




const { watch, series } = require('gulp');


var gulp = require('gulp');
// var sourcemaps = require('gulp-sourcemaps');

var plugins = {
	less: require('gulp-less'),
	cleancss: require('gulp-clean-css'),
	autoprefix: require('less-plugin-autoprefix'),
  sourcemaps: require('gulp-sourcemaps')
};

var paths = {
	origin: {
		less: {
			base: drupal_theme_path + '/less/style.less',
			importPaths: [
				drupal_theme_path + '/less',
				// './less/components'

			]

		}

	},

	destination: {
		less: drupal_theme_path + '/css'
	}

};

exports.watch = function() {
  watch(drupal_theme_path + '/less/**/*.less', gulp.series('less'));
};

gulp.task('less', function() {
  return gulp.src(paths.origin.less.base)
    .pipe(plugins.sourcemaps.init())
		.pipe(plugins.less({
			paths: paths.origin.less.importPaths,
			plugins: [
				new plugins.autoprefix({browsers: ["last 10 versions"]}),
			]
		}))
    .pipe(plugins.cleancss({compatibility: 'ie10'}))
    .pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(paths.destination.less));

});

