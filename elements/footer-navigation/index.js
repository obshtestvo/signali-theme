require('./footer-navigation.scss')

module.exports = function (componentService) {
    componentService.register('footer-navigation', {
        template: require('./footer-navigation.html')
    })
}