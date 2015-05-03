require('./select-dropdown.scss');
var selectize = require('selectize/dist/js/selectize');

module.exports = function (componentService) {
    var name = 'selectDropdown';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./select-dropdown.html'),
        publish: {
            id: '@',
            name: '@',
            value: '@',
        },
        attached: function (scope, $el) {
            $el.find('> input:text').selectize({
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