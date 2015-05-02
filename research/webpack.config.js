var standardConfig = require('../webpack.config')
var path = require('path');
var pwd = __dirname;
standardConfig.output.publicPath = 'build/';
standardConfig.output.path = path.normalize(pwd + '/build');
standardConfig.resolve.root = [
    path.normalize(pwd + '/../elements/app/script'),
    path.normalize(pwd + '/../elements'),
    path.normalize(pwd + '/../vendor'),
]
module.exports = standardConfig;