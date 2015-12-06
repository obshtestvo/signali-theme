var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var pwd = __dirname
var devtoolModuleFilenameTemplate = process.platform === "win32" ? "[resource-path]" : "file:///[resource-path]";

var config = {};

/**************** INPUT ***************/
config.entry = {
    app: 'signali',
    admin: 'admin',
    head: [
        'modernizr/modernizr',
    ]
};

/**************** OUTPUT ***************/
config.output = {
    path: path.normalize(pwd + '/build'),
    filename: '[name].js',
    publicPath: '/static/',
    devtoolModuleFilenameTemplate: devtoolModuleFilenameTemplate
};

/**************** PLUGINS ***************/
config.plugins = [
    new ExtractTextPlugin("[name].css"),
];
if (process.env.PRODUCTION) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: false,
        sourceMap: false,
        output: {comments: false}
    }));
    config.plugins.push(new webpack.optimize.DedupePlugin())
}

/**************** RESOLVING NAMES ***************/
config.resolve = {
    root: [
        path.normalize(pwd + '/elements/signali'),
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
var skipProcessingLoader = "script";
if (process.env.PRODUCTION) {
    svgExtraLoaders = '!svgo';
    skipProcessingLoader = "imports?this=>window&module=>false&exports=>false&define=>false";
}
config.module = {
    loaders: [
        {
            test: /packery|draggabilly|drop\/drop|debounce|([Ss]elect2[\/a-zA-Z\._0-9]+js)|holderjs\/holder|blueimp|modernizr|skatejs\/dist|magnific\-popup\/src\/js|magnific-popup\/dist\/jquery\.magnific|block-ui|MutationObserver|skatejs\-polyfill\-mutation\-observer/,
            loader: skipProcessingLoader
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css?sourceMap!postcss!ruby-sass")
        },
        {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
        {test: /autorequire\/.+$/, loader: "file?name=auto/[name].[ext]"},
        {test: /^(?:(?!autorequire).)+\.gif$/, loader: "url?limit=100000&mimetype=image/gif"},
        {test: /^(?:(?!autorequire).)+\.png$/, loader: "url?limit=100000&mimetype=image/png"},
        {test: /^(?:(?!autorequire).)+\.jpg$/, loader: "file"},
        {test: /\.html$/, loader: "mustache"},
        {test: /\.svg/, loader: "raw"+svgExtraLoaders},
    ]
};

if (process.env.PRODUCTION) {
    /**************** POSTCSS module ***************/
    config.postcss = [autoprefixer];
}

/**************** File changes watching/monitoring options ***************/
config.watchOptions = {
    aggregateTimeout: 100
};

module.exports = config;
