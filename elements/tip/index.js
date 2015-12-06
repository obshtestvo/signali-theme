require('./tip.scss')

module.exports = function (componentService) {
    componentService.register('tip', {
        template: require('./tip.html'),
        include: {
            questionIcon: require('./questionIcon.svg')
        }
    })
}