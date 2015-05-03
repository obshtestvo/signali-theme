require('./action-button.scss')

module.exports = function (componentService) {
    var name = 'actionButton';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./action-button.html'),
        publish:{
            "align":"@",
            "outlined":"@",
            "action": '@',
            "color": '@',
            "secondary": '@',
        },
        attached: function (scope) {
            scope.outlined = 'outlined' in scope ? 'outlined' : ''
            scope.secondary = 'secondary' in scope ? 'secondary' : ''
        }
    })
}