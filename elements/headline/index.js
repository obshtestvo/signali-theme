require('./headline.scss')

module.exports = function (componentService) {
    componentService.register('headline', {
        template: require('./headline.html')
    })
}