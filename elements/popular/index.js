require('./popular.scss')

module.exports = function (componentService) {
    componentService.register('popular', {
        template: require('./popular.html')
    })
}