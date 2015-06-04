require('./top-nav.scss')

module.exports = function (componentService) {
    componentService.register('top-nav', {
        template: require('./top-nav.html'),
        created: function (el) {
        }
    })
}