require('./radio-button.scss');

module.exports = function (componentService) {
    var name = 'radioButton';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./radio-button.html'),
        publish: {
            checked: '@',
            id: '@',
            name: '@',
        },
        attached: function (scope) {
            scope.checked = 'checked' in scope
        }
    })
}