require('./crumb.scss')

module.exports = function (componentService) {
    componentService.register('crumb', {
        template: require('./crumb.html'),
        include: {
            arrow: require('./arrow.svg')
        }
    })
}