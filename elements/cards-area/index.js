require('./cards-area.scss')

module.exports = function (componentService) {
    componentService.register('cards-area', {
        template: require('./cards-area.html')
    })
}