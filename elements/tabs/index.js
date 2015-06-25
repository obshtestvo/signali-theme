require('./tabs.scss')

module.exports = function (componentService) {
    var name = 'tabs';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./tabs.html')
    })
}