module.exports = function (componentService) {
    var name = 'opensansFont';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./opensans.html')
    })
}