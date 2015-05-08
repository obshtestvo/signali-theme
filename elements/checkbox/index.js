require('./checkbox.scss');

module.exports = function (componentService) {
    componentService.register('checkbox', {
        template: require('./checkbox.html'),
        attached: function (scope) {
            scope.checked = 'checked' in scope
        }
    })
}