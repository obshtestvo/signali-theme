var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var pwd = __dirname
module.exports = {
    entry: {
        app: 'app/script',
        head: [
            'modernizr/modernizr',
        ]
        //style: 'app/style/app.scss',
        //vendors: [
        //    //'./static/lib/angular/angular',
        //    //'./static/lib/jquery/dist/jquery',
        //    //__dirname + '/static/lib/drop/drop',
        //]
    },
    output: {
        path: path.normalize(pwd + '/build'),
        filename: 'bundle.js',
        publicPath: '/static/',
        devtoolModuleFilenameTemplate: 'file:///[resource-path]'
    },
    cache: false,
    plugins: [
        new ExtractTextPlugin("[name].css"),
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.optimize.CommonsChunkPlugin('head', 'head.js')
    ],
    resolve: {
        root: [
            path.normalize(pwd + '/elements/app/script'),
            path.normalize(pwd + '/elements'),
            path.normalize(pwd + '/vendor'),
        ],
        alias: {
            'jquery': 'jquery/dist/jquery',
        },
        // you can now require('file') instead of require('file.js')
        extensions: ['', '.js', '.json']
    },
    devtool: "sourcemap",
    module: {
        loaders: [
            {
                test: /packery|draggabilly|drop\/drop|debounce|holderjs\/holder|blueimp|modernizr/,
                loader: "imports?this=>window&module=>false&exports=>false&define=>false"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css?sourceMap!ruby-sass")
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
            {test: /\.png$/, loader: "url?limit=100000&mimetype=image/png"},
            {test: /\.jpg$/, loader: "file"},
            {test: /\.html$/, loader: "raw"},
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
    }
};
