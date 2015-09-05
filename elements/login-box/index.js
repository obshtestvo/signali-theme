require('./login-box.scss')

module.exports = function (componentService) {
    componentService.register('login-box', {
        template: require('./login-box.html'),
        include: {
            iconUser: require('./user.svg')
        }
    })
}