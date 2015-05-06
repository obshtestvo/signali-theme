require('./breadcrumb.scss')

module.exports = function (componentService) {
    var name = 'breadcrumb';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./breadcrumb.html'),
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