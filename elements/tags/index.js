require('./tags.scss')

module.exports = function (componentService) {
    var name = 'tags';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./tags.html')
    })
}