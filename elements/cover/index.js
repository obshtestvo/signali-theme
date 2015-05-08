require('./cover.scss')

module.exports = function (componentService) {
    componentService.register('cover', {
        template: require('./cover.html'),
        attached: function (el) {
            // javascript to run after the element is rendered in the dom
        }
    })
}