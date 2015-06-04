var standardConfig = require('../webpack.config')
var path = require('path');
var pwd = __dirname;
standardConfig.output.publicPath = '';
standardConfig.output.path = path.normalize(pwd + '/build');
standardConfig.resolve.root = [
    path.normalize(pwd + '/../elements/app'),
    path.normalize(pwd + '/../elements'),
    path.normalize(pwd + '/../vendor'),
]
module.exports = standardConfig;