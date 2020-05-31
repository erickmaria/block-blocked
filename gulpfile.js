'use strict';

const
	gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	clean = require('gulp-clean'),
	ts = require('gulp-typescript'),
	webpack = require('webpack'),
	webpackConfig = require('./webpack.config.js'),
	gulpWebpack = require('webpack-stream'),
	exec = require('child_process').exec;

const
	WATCH_SRC_DIR = {
		transpile: './src/game',
		build: './dist/game'
	},
	// BUILD_SERVER_SRC_DIR = './src/server/**/*.ts',
	// BUILD_SERVER_DIST_DIR = ['./dist/server'],
	// BUILD_GAME_SRC_DIR = './src/game/**/*.ts',
	// BUILD_GAME_DIST_DIR = './dist/public',
	BUILD_SRC_DIR = './dist/game',
	BUILD_DIST_DIR = './dist/public',
	PREBUILD_CLEAN_DIST = './dist',
	POSBUILD_CLEAN_DIST = './dist/game',
	SERVER_DIST_DIR = './dist/server',
	SERVER_FINAME_NAME = '/server.js',
	SERVER_COMMAND_EXEC = `node -r esm ${SERVER_DIST_DIR}${SERVER_FINAME_NAME}`;

let tsProject = ts.createProject("tsconfig.json");

let cleanFunc = (path) => {
	return gulp.src([path], { read: false, allowEmpty: true })
		.pipe(clean({ force: true }));
};

// Pre Build Clean
gulp.task('pre-build-clean', () => {
	return cleanFunc(PREBUILD_CLEAN_DIST)
});

// Pos Build Clean
gulp.task('pos-build-clean', () => {
	return cleanFunc(POSBUILD_CLEAN_DIST)
});


// Transpile
gulp.task("transpile", function () {
	return tsProject
		.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest(tsProject.options.outDir));
});

// Generate Development Build
gulp.task('build', () => {
	return gulp.src(BUILD_SRC_DIR)
		.pipe(plumber()
			.on('error', (err) => {
				console.log(err);
			}))
		.pipe(gulpWebpack(webpackConfig, webpack))
		.pipe(gulp.dest(BUILD_DIST_DIR));
});

// Watch
gulp.task('watch', () => {
	gulp.watch([WATCH_SRC_DIR.transpile], gulp.series('transpile'));
	gulp.watch([WATCH_SRC_DIR.build], gulp.series('build'));
});

// Exec Server
gulp.task('server', (cb) => {
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

// Run Tasks
gulp.task(
	'prod',
	gulp.series(
		'pre-build-clean',
		'transpile',
		'build',
		'pos-build-clean',
		'server'
	)
);

gulp.task(
	'dev',
	gulp.series(
		'pre-build-clean',
		'transpile',
		'build',
		gulp.parallel(
			'watch',
			'server'
		)
	)
);