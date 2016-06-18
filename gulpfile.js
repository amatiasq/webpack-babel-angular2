var gulp = require('gulp');
var gutil = require('gutil');
var webpack = require('webpack');
var config = require('./webpack.config');

gulp.task('default', function(callback) {
  webpack(config, function(error, stats) {
    if (error) throw new gutil.PluginError('webpack', error);
    gutil.log('[webpack]', stats.toString());
    callback();
  });
});
