require('./cover.scss')

module.exports = function (componentService) {
    componentService.register('cover', {
        template: require('./cover.html')
    })
}