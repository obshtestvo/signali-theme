$ = require('jquery');
require('./auth.scss');

module.exports = function (componentService) {
    require('./auth')(componentService);
    require('./container')(componentService);
    require('./required')(componentService);
    require('./trigger')(componentService);
};