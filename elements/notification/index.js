require('./notification.scss')

module.exports = function (componentService) {
    componentService.register('notification', {
        template: require('./notification.html'),
        include: {
            iconCheck: require('./check-circle.svg'),
            iconExclamation: require('./exclamation-circle.svg'),
            iconInfo: require('./info-circle.svg')
        }
    })
}