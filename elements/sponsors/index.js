require('./sponsors.scss')

module.exports = function (componentService) {
    componentService.register('sponsors', {
        template: require('./sponsors.html')
    })
}