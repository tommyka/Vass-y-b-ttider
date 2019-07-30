var gulp = require('gulp');
var typescript = require('gulp-typescript');
var less = require('gulp-less');
var browser = require('browser-sync');

var ts_main = "src/script/main.ts";
var ts_output = "dist/assets/scripts/";

var less_src = "src/style/*.less";
var less_output = "dist/assets/css/";

gulp.task('browsersync', function(){
	browser({
		server: {
			baseDir: "./dist/"
		}
	});
});


gulp.task('compile-ts', function(){
	var ts = gulp.src(ts_main)
		.pipe(typescript({
			target: 'ES5',
			outFile: 'main.js'
		}));

	ts.pipe(gulp.dest(ts_output));
});

gulp.task('less',function(){
	gulp.src(less_src)
		.pipe(less())
		.on('error', function(err){ console.log(err.message); })
		.pipe(gulp.dest(less_output));
});


gulp.task('watch', function(){
	gulp.watch(['src/**/*.ts'],['compile-ts', 'reload']);
	gulp.watch(['style/**/*.less'], ['less', 'reload']);
});

gulp.task('reload', function(){
	browser.reload();
});


gulp.task('default', ['less', 'compile-ts', 'browsersync', 'watch']);
gulp.task('build', ['less', 'compile-ts']);