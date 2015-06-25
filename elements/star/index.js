require('./star.scss')

module.exports = function (componentService) {
    componentService.register('star', {
        template: require('./star.html')
    })
}