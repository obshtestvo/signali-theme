$ = require('jquery');
require('./auth.scss');

module.exports = function (componentService) {
    require('./auth')(componentService);
    require('./modal')(componentService);
    require('./required')(componentService);
    require('./trigger')(componentService);
};