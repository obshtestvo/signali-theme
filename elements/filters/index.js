require('./filters.scss')

module.exports = function (componentService) {
    componentService.register('filters', {
        template: require('./filters.html')
    })
}