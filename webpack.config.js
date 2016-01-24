var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var pwd = __dirname;
var devtoolModuleFilenameTemplate = process.platform === 'win32' ? '[resource-path]' : 'file:///[resource-path]';
var regexPathSep = process.platform === 'win32' ? '\\\\' : '\/';
var PRODUCTION = process.env.PRODUCTION;

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
config.plugins = [];
if (PRODUCTION) {
    config.plugins.push(new ExtractTextPlugin('[name].css'));
    config.plugins.push(new webpack.optimize.DedupePlugin());
    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
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
        path.normalize(pwd + '/elements')
    ],
    alias: {
        'jquery': 'jquery/dist/jquery'
    },
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
};
config.externals = {
    fb: 'var FB',
    'google-analytics': 'var ga',
    modernizr: 'var Modernizer'
};

/**************** DEV TOOLS ***************/
if (!PRODUCTION) {
    config.devtool = 'sourcemap';
}


/**************** MODULE LOADING ***************/
var svgExtraLoaders = '';
if (PRODUCTION) {
    svgExtraLoaders = '!svgo';
}
var skipProcessingLoader = 'imports?this=>window&module=>false&exports=>false&define=>false';
var getStylingLoader = function(additionalLoaders) {
    var loaders = 'style!css?-minimize!postcss';
    if (additionalLoaders) loaders += additionalLoaders;
    if (!PRODUCTION) return loaders;
    loaders = loaders.split('!');
    return ExtractTextPlugin.extract(loaders[0], loaders.splice(1).join('!'))
};
config.module = {
    preLoaders:[
        {test: /\.js$/, loader: 'eslint', exclude: /node_modules/}
    ],
    loaders: [
        {
            test: /block-ui|tooltipster/,
            loader: skipProcessingLoader
        },
        {
            test: /\.modernizrrc$/,
            loader: 'modernizr'
        },
        {
            test: /\.scss$/,
            loader: getStylingLoader('!sass')
        },
        {test: /\.css$/, loader: getStylingLoader()},
        {test: new RegExp('autorequire'+regexPathSep+'.+$'), loader: 'file?name=auto/[name].[ext]'},
        {test: /^(?:(?!autorequire).)+\.gif$/, loader: 'url?limit=100000&mimetype=image/gif'},
        {test: /^(?:(?!autorequire).)+\.png$/, loader: 'url?limit=100000&mimetype=image/png'},
        {test: /^(?:(?!autorequire).)+\.jpg$/, loader: 'file'},
        {test: /\.html$/, loader: 'mustache'},
        {test: /\.svg$/, loader: 'raw'+svgExtraLoaders},
        {
            test: new RegExp('(:?elements'+regexPathSep+'|node_modules'+regexPathSep+'skate).+\.js$'),
            loader: 'babel',
            query: {
                cacheDirectory: true,
                plugins: ['transform-class-properties'],
                presets: ['es2015']
            }
        }
    ]
};

/**************** POSTCSS module ***************/
config.postcss = [autoprefixer({ browsers: [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 35',
    'Firefox >= 31',
    'Explorer >= 9',
    'iOS >= 7',
    'Opera >= 12',
    'Safari >= 7.1'
]})];

/**************** File changes watching/monitoring options ***************/
config.watchOptions = {
    aggregateTimeout: 100
};

module.exports = config;
