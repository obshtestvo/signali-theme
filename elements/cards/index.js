require('./cards.scss')

module.exports = function (componentService) {
    componentService.register('cards', {
        template: require('./cards.html')
    })
}