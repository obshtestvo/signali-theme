require('./tabs-nav.scss')

module.exports = function (componentService) {
    var name = 'tabs-nav';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./tabs-nav.html'),
        publish: {
            "align": "@"
        }
    })
}