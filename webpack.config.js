var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer-core');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var pwd = __dirname
var devtoolModuleFilenameTemplate = process.platform === "win32" ? "[resource-path]" : "file:///[resource-path]";

var config = {};

/**************** INPUT ***************/
config.entry = {
    app: 'app',
    head: [
        'modernizr/modernizr',
    ]
};

/**************** OUTPUT ***************/
config.output = {
    path: path.normalize(pwd + '/build'),
    filename: 'bundle.js',
    publicPath: '/static/',
    devtoolModuleFilenameTemplate: devtoolModuleFilenameTemplate
};

/**************** PLUGINS ***************/
config.plugins = [
    new webpack.optimize.CommonsChunkPlugin('head', 'head.js')
];
if (process.env.PRODUCTION) {
    config.unshift(new ExtractTextPlugin("[name].css"));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: false,
        sourceMap: false,
        output: {comments: false}
    }))
}

/**************** RESOLVING NAMES ***************/
config.resolve = {
    root: [
        path.normalize(pwd + '/elements/app'),
        path.normalize(pwd + '/elements'),
    ],
    alias: {
        'jquery': 'jquery/dist/jquery',
    },
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
};

/**************** DEV TOOLS ***************/
if (!process.env.PRODUCTION) {
    config.devtool = "sourcemap";
}


/**************** MODULE LOADING ***************/
var svgExtraLoaders = '';
if (process.env.PRODUCTION) {
    svgExtraLoaders = '!svgo'
}
config.module = {
    loaders: [
        {
            test: /packery|draggabilly|drop\/drop|debounce|holderjs\/holder|blueimp|modernizr|skatejs/,
            loader: "script"
        },
        {
            test: /\.scss$/,
            loader: !process.env.PRODUCTION ? "style!css?sourceMap!ruby-sass" : ExtractTextPlugin.extract("style", "css!postcss!ruby-sass")
        },
        {test: /\.css$/, loader: !process.env.PRODUCTION ? "style!css" : ExtractTextPlugin.extract("style", "css")},
        {test: /\.png$/, loader: "url?limit=100000&mimetype=image/png"},
        {test: /\.jpg$/, loader: "file"},
        {test: /\.html$/, loader: "mustache"},
        {test: /\.svg/, loader: "raw"+svgExtraLoaders},
        //{test: /\.jpg$/, loader: "file?name=[path][name].[ext]?[hash]"}
    ]
};

/**************** POSTCSS module ***************/
config.postcss = [autoprefixer];

/**************** File changes watching/monitoring options ***************/
config.watchOptions = {
    aggregateTimeout: 100
};

module.exports = config;