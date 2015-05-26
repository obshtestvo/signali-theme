require('./card.scss')

module.exports = function (componentService) {
    componentService.register('card', {
        template: require('./card.html')
    })
}