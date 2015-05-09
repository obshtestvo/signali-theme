require('./action-button.scss')

module.exports = function (componentService) {
    var name = 'actionButton';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./action-button.html')
    })
}