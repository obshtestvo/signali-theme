require('./bubble.scss')

module.exports = function (componentService) {
    componentService.register('bubble', {
        template: require('./bubble.html'),
        include: {
            iconCheck: require('./check-circle.svg'),
            iconExclamation: require('./exclamation-circle.svg'),
            iconInfo: require('./info-circle.svg')
        }
    })
}