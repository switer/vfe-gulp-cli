'use strict';

var gutil = require('gulp-util')
var chalk = require('chalk')
var resolve = require('resolve')
var prettyTime = require('pretty-hrtime')

module.exports = function () {

    var gulp = require(resolve.sync('gulp', {
        basedir: process.cwd()
    }))
    
    require(resolve.sync('./gulpfile.js', {
        basedir: process.cwd()
    }))

    // Total hack due to poor error management in orchestrator
    gulp.on('err', function() {
        failed = true
    })
    gulp.on('task_start', function(e) {
        // so when 5 tasks start at once it only logs one time with all 5
        gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...')
    })
    gulp.on('task_stop', function(e) {
        // Format orchestrator errors
        function formatError(e) {
            if (!e.err) {
                return e.message
            }
            // PluginError
            if (typeof e.err.showStack === 'boolean') {
                return e.err.toString()
            }
            // Normal error
            if (e.err.stack) {
                return e.err.stack
            }
            // Unknown (string, number, etc.)
            return new Error(String(e.err)).stack
        }

        var time = prettyTime(e.hrDuration)
        gutil.log(
            'Finished', '\'' + chalk.cyan(e.task) + '\'',
            'after', chalk.magenta(time)
        )
    })
    gulp.on('task_err', function(e) {
        var msg = formatError(e)
        var time = prettyTime(e.hrDuration)
        gutil.log(
            '\'' + chalk.cyan(e.task) + '\'',
            chalk.red('errored after'),
            chalk.magenta(time)
        )
        gutil.log(msg)
    })
    gulp.on('task_not_found', function(err) {
        gutil.log(
            chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
        )
        gutil.log('Please check the documentation for proper gulpfile formatting')
        process.exit(1)
    })

    return gulp
}