var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer-core');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var pwd = __dirname
var devtoolModuleFilenameTemplate = process.platform === "win32" ? "[resource-path]" : "file:///[resource-path]";

var config = {};

/**************** INPUT ***************/
config.entry = {
    app: 'app/script',
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
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.CommonsChunkPlugin('head', 'head.js')
];
if (process.env.PRODUCTION) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: false,
        sourceMap: false,
        output: {comments: false}
    }))
}

/**************** RESOLVING NAMES ***************/
config.resolve = {
    root: [
        path.normalize(pwd + '/elements/app/script'),
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
            test: /packery|draggabilly|drop\/drop|debounce|holderjs\/holder|blueimp|modernizr/,
            loader: "imports?this=>window&module=>false&exports=>false&define=>false"
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css?sourceMap!postcss!ruby-sass")
        },
        {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
        {test: /\.png$/, loader: "url?limit=100000&mimetype=image/png"},
        {test: /\.jpg$/, loader: "file"},
        {test: /\.html$/, loader: "mustache"},
        {test: /\.svg/, loader: "raw"+svgExtraLoaders},
        //{test: /\.jpg$/, loader: "file?name=[path][name].[ext]?[hash]"}
    ],
    noParse: [
        /packery/,
        /modernizr/,
        /draggabilly/,
        /zepto/,
        /angular/,
        /drop\/drop/,
        /dist\/waves/,
        /throttle-debounce/,
        /holderjs\/holder/,
        /lumx/,
        /blueimp/,
    ]
};

/**************** POSTCSS module ***************/
config.postcss = [autoprefixer];

module.exports = config;