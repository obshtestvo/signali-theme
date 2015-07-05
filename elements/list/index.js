require('./list.scss')

module.exports = function (componentService) {
    componentService.register('list', {
        template: require('./list.html')
    })
}