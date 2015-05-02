require('./calltoaction.scss')

module.exports = function (componentService) {
    var name = 'calltoaction';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./calltoaction.html'),
        publish:{
            "align":"@",
            "outlined":"@",
        },
        attached: function (scope) {
            scope.outlined = 'outlined' in scope ? 'outlined' : ''
        }
    })
}