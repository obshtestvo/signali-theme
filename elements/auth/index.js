$ = require('jquery');
require('./auth.scss');

module.exports = function (componentService, adaptors) {
    require('./auth')(componentService);
    require('./container')(componentService);
    require('./required')(componentService, adaptors);
    require('./trigger')(componentService);
};