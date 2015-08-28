require('./pagination.scss')

module.exports = function (componentService) {
    componentService.register('pagination', {
        template: require('./pagination.html')
    })
}