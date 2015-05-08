require('./select-dropdown.scss');
var selectize = require('selectize/dist/js/selectize');

module.exports = function (componentService) {
    componentService.register('select-dropdown', {
        template: require('./select-dropdown.html'),
        attached: function (el) {
            $(el).find('> input:text').selectize({
                delimiter: ',',
                persist: false,
                create: function (input) {
                    return {
                        value: input,
                        text: input
                    }
                }
            });
        }
    })
}