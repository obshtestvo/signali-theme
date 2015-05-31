require('./footer-column.scss')

module.exports = function (componentService) {
    componentService.register('footer-column', {
        template: require('./footer-column.html')
    })
}