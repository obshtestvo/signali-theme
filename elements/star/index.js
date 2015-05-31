require('./star.scss')

module.exports = function (componentService) {
    componentService.register('star', {
        template: require('./star.html'),
        include: {
            star: require('./star.svg')
        }
    })
}