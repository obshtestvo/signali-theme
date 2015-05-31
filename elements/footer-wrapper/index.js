require('./footer-wrapper.scss')

module.exports = function (componentService) {
    componentService.register('footer-wrapper', {
        template: require('./footer-wrapper.html')
    })
}