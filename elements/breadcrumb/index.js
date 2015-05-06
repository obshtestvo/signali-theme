require('./breadcrumb.scss')

module.exports = function (componentService) {
    var name = 'breadcrumb';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./breadcrumb.html')
    })
}