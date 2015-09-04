var $ = require('jquery');
require('./social-insights.scss');

module.exports = function (componentService) {
    componentService.register('social-insights', {
        template: require('./social-insights.html')
    })
}