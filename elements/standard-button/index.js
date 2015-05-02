require('./standard-button.scss');

module.exports = function (componentService) {
    var name = 'standardButton';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./standard-button.html'),
        publish: {
            action: '@',
            disabled: '@',
            settings: '@',
        },
        attached: function (scope) {
            //console.log(JSON.parse(scope.settings))
        }
    })
}