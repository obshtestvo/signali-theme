require('./leading-area.scss')

module.exports = function (componentService) {
    componentService.register('leading-area', {
        template: require('./leading-area.html')
    })
}