require('./cover.scss')

module.exports = function (componentService) {
    var name = 'cover';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./cover.html'),
        attached: function (scope, $el, attrs, ctrls, transclude) {
            // javascript to run after the element is rendered in te dom
        }
    })
}