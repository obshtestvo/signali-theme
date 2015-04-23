var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: 'app/script'
        //style: 'app/style/app.scss',
        //vendors: [
        //    //'./static/lib/angular/angular',
        //    //'./static/lib/jquery/dist/jquery',
        //    //__dirname + '/static/lib/drop/drop',
        //]
    },
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    cache: false,
    plugins: [
        new ExtractTextPlugin("[name].css"),
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),
        //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    resolve: {
        root: [
            __dirname + '/elements',
            __dirname + '/vendor',
        ],
        alias: {
            'jquery': 'jquery/dist/jquery',
        },
        // you can now require('file') instead of require('file.js')
        extensions: ['', '.js', '.json']
    },
    module: {
        loaders: [
            {
                test: /packery|draggabilly|drop\/drop|debounce|holderjs\/holder|blueimp/,
                loader: "imports?this=>window&module=>false&exports=>false&define=>false"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css!ruby-sass")
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
            {test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png"},
            {test: /\.jpg$/, loader: "file"},
            //{test: /\.jpg$/, loader: "file?name=[path][name].[ext]?[hash]"}
        ],
        noParse: [
            /packery/,
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
