require('./crumb.scss')

module.exports = function (componentService) {
    var name = 'crumb';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./crumb.html'),
        publish:{
            "action": '@'
        }
    })
}