'use strict';

const
	gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	// nodemon = require('gulp-nodemon'),
	// path = require('path'),
	inject = require('gulp-inject'),
	ts = require('gulp-typescript'),
	webpack = require('gulp-webpack'),
	exec = require('child_process').exec;

const
	SRC_DIR = './dist/game/*.js',
	OUTPUT_BUNBLE_NAME = 'game.js',
	DIST_DIR = './dist/public/game',
	DIST_FILE_NAME = 'game.js',
	INJECT_TARGET = './src/web/*.html',
	INJECT_SOURCE = './dist/public/game/*js',
	INJECT_IGNORE_PATH = '/dist/public',
	INJECT_DIST = './dist/public',
	CLEAN_DIST = './dist',
	SERVER_DIR = './dist/server',
	SERVER_FINAME_NAME = '/server.js',
	SERVER_PROD_COMMAND_EXEC = `node -r esm ${SERVER_DIR}${SERVER_FINAME_NAME}`;

let tsProject = ts.createProject("tsconfig.json");

let webpackOptions = {
	output: {
		filename: OUTPUT_BUNBLE_NAME,
	  },
}

// Clean
gulp.task('clean', () => {
	return gulp.src([CLEAN_DIST], { read: false, allowEmpty: true })
		.pipe(clean({ force: true }));
});

// Transpile
gulp.task("transpile", function () {
	return tsProject
		.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest(tsProject.options.outDir));
});

// Minify e Concat Scripts
gulp.task('build-prod', () => {
	return gulp.src(SRC_DIR)
		.pipe(plumber()
			.on('error', (err) => {
				console.log(err);
			}))
		.pipe(webpack(webpackOptions))
		.pipe(uglify())
		.pipe(concat(DIST_FILE_NAME))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(DIST_DIR));
});

gulp.task('build-dev', () => {
	return gulp.src(SRC_DIR)
		.pipe(plumber()
			.on('error', (err) => {
				console.log(err);
			}))
		.pipe(webpack(webpackOptions))
		.pipe(gulp.dest(DIST_DIR));
});

// Inject
gulp.task('inject', () => {
	return gulp.src(INJECT_TARGET)
		.pipe(inject(gulp.src([INJECT_SOURCE], { read: false }), { ignorePath: [INJECT_IGNORE_PATH] }))
		.pipe(gulp.dest(INJECT_DIST));
});

// Watch
gulp.task('watch', () => {
	gulp.watch([tsProject.config.include.toString()], gulp.series('transpile'));
	gulp.watch([SRC_DIR], gulp.series('build-dev'));
});

// Exec
gulp.task('server-prod', (cb) => {
	exec(SERVER_PROD_COMMAND_EXEC, (err, stdout, stderr) => {
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

gulp.task('server-dev', (cb) => {
	exec("node -r esm ./dist/server/server.js", (err, stdout, stderr) => {
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
// gulp.task('server-dev', () => {
// 	nodemon(path.join(__dirname, 'nodemon.json'));
// })

// Run Tasks
gulp.task('prod',
	gulp.series('clean', 'transpile', 'build-prod', 'inject', 'server-prod'));
gulp.task('dev',
	gulp.series('clean', 'transpile', 'build-dev', 'inject',
		gulp.parallel('watch', 'server-dev')));