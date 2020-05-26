'use strict';

// import gulp from 'gulp'
// import concat from 'gulp-concat'
// import uglify from 'gulp-uglify'
// import rename from 'gulp-rename'

const 
	gulp  	= require('gulp'),
	plumber = require('gulp-plumber'),
	concat  = require('gulp-concat'),
	uglify  = require('gulp-uglify'),
	rename  = require('gulp-rename'),
	clean   = require('gulp-clean'),
	nodemon	= require('gulp-nodemon'),
	spawn   = require('child_process').spawn;
	// jshint  = require('gulp-jshint');

const 
	SRC_DIR        	   = './game/*.js',
	DIST_DIR 	   	   = './public/js',
	DIST_FILE_NAME 	   = 'bundle.js',
	SERVER_DIR 	   	   = './server',
	SERVER_FINAME_NAME = '/server.js';
 
// Clean
gulp.task('clean', () => {
	return gulp.src([DIST_DIR], {read: false, allowEmpty: true})
	  .pipe(clean());
});

// gulp.task('lint', function () {
// 	gulp.src('./**/*.js')
// 	  .pipe(jshint());
// });

// Minify e Concat Scripts
gulp.task('bundle', function() {
	return gulp.src(SRC_DIR)
		.pipe(plumber()
			.on('error', (err) => { 
				console.log(err);
			}))
	    .pipe(uglify())
		.pipe(concat(DIST_FILE_NAME))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(DIST_DIR));
});

// Watch
gulp.task('watch', () => {
	gulp.watch([SRC_DIR], gulp.series('bundle'));
});

// Nodemon run Server
gulp.task('server', (done) => {

	let bunyan;

	nodemon({
		// script: `${SERVER_DIR}${SERVER_FINAME_NAME}`,
		ext: 'js',
		exec: `npm start`,
        ignore: [
            'node_modules/'
		],
		// tasks: ['bundle', 'watch'],
        watch:    [SERVER_DIR],
        done: done
	})
	.on('readable', function() {
 
        // free memory
        bunyan && bunyan.kill()
 
        bunyan = spawn('./node_modules/bunyan/bin/bunyan', [
            '--output', 'short',
            '--color'
        ])
 
        bunyan.stdout.pipe(process.stdout)
        bunyan.stderr.pipe(process.stderr)
 
        this.stdout.pipe(bunyan.stdin)
        this.stderr.pipe(bunyan.stdin)
    })
	.on('start', ['watch'])
	.on('restart', function () {
		console.log('server restarted!');
	})
	.on('crash', function() {
		console.error('Application has crashed!\n');
	});
})

// Default task
// gulp.task('default', gulp.series('clean', 'server'));