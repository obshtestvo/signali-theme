require('./calltoaction.scss')

module.exports = function (componentService) {
    var name = 'calltoaction';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./calltoaction.html'),
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