require('./more-button.scss')

module.exports = function (componentService) {
    componentService.register('more-button', {
        template: require('./more-button.html'),
        include: {
            arrow: require('./chevron-circle-right.svg')
        }
    })
}