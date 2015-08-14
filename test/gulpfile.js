'use strict';

var gulp = require('gulp')
gulp.task('default', function () {
	console.log('Task start ~!')
})
gulp.task('watch', function () {
	console.log('Run watcher ~!')
	gulp.watch(['./test.js'], function () {
		console.log('File changed.')
	})
})