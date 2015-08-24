require('./features.scss')

module.exports = function (componentService) {
    componentService.register('features', {
        template: require('./features.html')
    })
}