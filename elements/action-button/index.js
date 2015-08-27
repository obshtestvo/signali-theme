require('./action-button.scss')

module.exports = function (componentService) {
    componentService.register('action-button', {
        template: require('./action-button.html'),
        include: {
            "arrow": require('./chevron-circle-right.svg'),
            "reply-icon": require('./reply.svg')
        }
    })
}