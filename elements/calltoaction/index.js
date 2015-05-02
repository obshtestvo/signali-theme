require('./calltoaction.scss')

module.exports = function (componentService) {
    var name = 'calltoaction';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./calltoaction.html'),
        attached: function (scope, $el, attrs, ctrls, transclude) {
            // javascript to run after the element is rendered in te dom
        }
    })
}