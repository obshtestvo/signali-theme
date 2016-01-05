var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AggressiveMergingPlugin  = require("webpack/lib/optimize/AggressiveMergingPlugin");
var pwd = __dirname;
var devtoolModuleFilenameTemplate = process.platform === "win32" ? "[resource-path]" : "file:///[resource-path]";

var config = {};

/**************** INPUT ***************/
config.entry = {
    app: 'signali',
    admin: 'admin',
    admin_vendor: 'admin/vendor',
    head: [
        '.modernizrrc'
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
    config.plugins.push(new AggressiveMergingPlugin());
    config.plugins.push(new webpack.optimize.DedupePlugin())
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: false,
        mangle: {
            except: ['$super', '$', 'exports', 'require']
        },
        output: {comments: false}
    }));
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
if (process.env.PRODUCTION) {
    svgExtraLoaders = '!svgo';
}
config.module = {
    loaders: [
        {
            test: /\.modernizrrc$/,
            loader: "modernizr"
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css?sourceMap!postcss!ruby-sass")
        },
        {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css?sourceMap!postcss")},
        {test: /autorequire\/.+$/, loader: "file?name=auto/[name].[ext]"},
        {test: /^(?:(?!autorequire).)+\.gif$/, loader: "url?limit=100000&mimetype=image/gif"},
        {test: /^(?:(?!autorequire).)+\.png$/, loader: "url?limit=100000&mimetype=image/png"},
        {test: /^(?:(?!autorequire).)+\.jpg$/, loader: "file"},
        {test: /\.html$/, loader: "mustache"},
        {test: /\.svg$/, loader: "raw"+svgExtraLoaders},
        {
            test: /(:?elements\/|node_modules\/skate).+\.js$/,
            loader: 'babel',
            query: {
                cacheDirectory: true,
                plugins: ['transform-class-properties'],
                presets: ['es2015']
            }
        }
    ]
};

if (process.env.PRODUCTION) {
    /**************** POSTCSS module ***************/
    config.postcss = [autoprefixer({ browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 35',
        'Firefox >= 31',
        'Explorer >= 9',
        'iOS >= 7',
        'Opera >= 12',
        'Safari >= 7.1',
    ]})];
}

/**************** File changes watching/monitoring options ***************/
config.watchOptions = {
    aggregateTimeout: 100
};

module.exports = config;
