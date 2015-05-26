require('./secondary-nav.scss')

module.exports = function (componentService) {
    var name = 'secondary-nav';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./secondary-nav.html'),
        publish: {
            "align": "@"
        }
    })
}