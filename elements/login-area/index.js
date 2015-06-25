require('./login-area.scss')

module.exports = function (componentService) {
    componentService.register('login-area', {
        template: require('./login-area.html')
    })
}