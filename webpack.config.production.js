var webpack = require('webpack');
var config = require('./webpack.config')
delete config["devtool"];
//config.plugins.push(new webpack.optimize.DedupePlugin())
config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: false, output: {comments: false}}))

module.exports = config;