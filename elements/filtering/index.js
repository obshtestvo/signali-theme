require('./filtering.scss')

module.exports = function (componentService) {
    componentService.register('filtering', {
        template: require('./filtering.html')
    })
}