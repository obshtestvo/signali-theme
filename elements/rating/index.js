require('./rating.scss')

module.exports = function (componentService) {
    var name = 'rating';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./rating.html')
    })
}