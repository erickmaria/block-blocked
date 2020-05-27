'use strict';

const
	gulp  	= require('gulp'),
	plumber = require('gulp-plumber'),
	concat  = require('gulp-concat'),
	uglify  = require('gulp-uglify'),
	rename  = require('gulp-rename'),
	clean   = require('gulp-clean'),
	nodemon	= require('gulp-nodemon'),
	inject = require('gulp-inject'),
	exec   = require('child_process').exec,
	spawn   = require('child_process').spawn;

const
	SRC_DIR        	   	= './src/game/*.js',
	DIST_DIR 	   	   	= './src/public/game',
	DIST_FILE_NAME 	   	= 'game.js',
	INJECT_TARGET	   	= './src/web/*.html',
	INJECT_SOURCE	   	= './src/public/game/*js',
	INJECT_IGNORE_PATH 	= '/src/public',
	INJECT_DIST		   	= './src/public',
	SERVER_DIR 	   	   	= './src/server',
	SERVER_FINAME_NAME 	= '/server.js',
	SERVER_COMMAND_EXEC = `node -r esm ${SERVER_DIR}${SERVER_FINAME_NAME}`;
 
// Clean
gulp.task('clean', () => {
	return gulp.src([INJECT_DIST], {read: false, allowEmpty: true})
	  .pipe(clean({force: true}));
});

// Minify e Concat Scripts
gulp.task('build-prod', () => {
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

// Minify e Concat Scripts
gulp.task('build-dev', () => {
	return gulp.src(SRC_DIR)
		.pipe(plumber()
			.on('error', (err) => { 
				console.log(err);
			}))
		.pipe(concat(DIST_FILE_NAME))
		.pipe(gulp.dest(DIST_DIR));
});

// Inject
gulp.task('inject', () => {
	return gulp.src(INJECT_TARGET)
		.pipe(inject(gulp.src([INJECT_SOURCE],{read: false}), {ignorePath: [INJECT_IGNORE_PATH]}))
		.pipe(gulp.dest(INJECT_DIST));
});

// Watch
gulp.task('watch', () => {
	gulp.watch([SRC_DIR], gulp.series('build-dev'));
});

// Exec
gulp.task('server-prod', (cb) => {
	exec(SERVER_COMMAND_EXEC, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	})
	.on('exit', function (code) {
		console.log('child process exited with code ' + code.toString());
	})
	.stdout
	.on('data', (data) => {
		console.log(data.toString());
	});
});

// Nodemon
gulp.task('server-dev', (done) => {

	let bunyan;

	let modemon = nodemon({
		ext: 	'js',
		exec: 	`node -r esm ${SERVER_DIR}${SERVER_FINAME_NAME}`,
        ignore: [
            	'node_modules/'
		],
        watch:	[SERVER_DIR],
        done: 	done
	})
	
	modemon
		.on('readable', () => {
	
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
		// .on('start', [])
		.on('restart', () => {
			console.log('server restarted!');
		})
		.on('crash', () => {
			console.error('Application has crashed!\n');
			modemon.emit('restart', 10)
		});
})

// Run Tasks
gulp.task('prod',
	gulp.series('clean','build-prod', 'inject', 'server-prod'));
gulp.task('dev', 
	gulp.series('clean','build-dev', 'inject', 
		gulp.parallel('watch', 'server-dev')));