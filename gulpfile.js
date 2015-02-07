var gulp = require('gulp');
var typescript = require('gulp-tsc');
var less = require('gulp-less');
var webserver = require('gulp-webserver');
var opn = require("opn");

var ts_main = "src/main.ts";
var ts_output = "dist/assets/scripts/";

var less_src = "style/*.less";
var less_output = "dist/assets/css/";

gulp.task('default', function(){
	gulp.start('less');
	gulp.start('compile-ts');
	gulp.start('webserver');
});

gulp.task('compile-ts', function(){
	return gulp.src(ts_main)
		.pipe(typescript({out: "main.js", target:"ES5"/*, sourcemap: true*/}))
		.pipe(gulp.dest(ts_output));
});

gulp.task('less',function(){
	gulp.src(less_src)
		.pipe(less())
		.pipe(gulp.dest(less_output));
});

gulp.task('webserver', function(){
	opn( 'http://localhost:8000');
	/*gulp.src('dist/')
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true
		}));*/
});