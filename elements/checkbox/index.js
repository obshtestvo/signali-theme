require('./checkbox.scss');

module.exports = function (componentService) {
    var name = 'checkbox';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./checkbox.html'),
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