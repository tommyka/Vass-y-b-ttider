var gulp = require('gulp');
var typescript = require('gulp-typescript');
var less = require('gulp-less');
var browser = require('browser-sync');

var tsProject = typescript.createProject('tsconfig.json');

var ts_main = "src/main.ts";
var ts_output = "dist/assets/scripts/";

var less_src = "style/*.less";
var less_output = "dist/assets/css/";

gulp.task('browsersync', function(){
	browser({
		server: {
			baseDir: "./dist/"
		}
	});
});


gulp.task('compile-ts', function(){
	console.log("compile typescirp");
	var ts = gulp.src(ts_main)
		.pipe(typescript(tsProject));

	ts.js.pipe(gulp.dest(ts_output));
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