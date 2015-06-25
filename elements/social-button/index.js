require('./social-button.scss')

module.exports = function (componentService) {
    componentService.register('social-button', {
        template: require('./social-button.html'),
        include: {
            facebookIcon: require('./facebook.svg'),
            googleIcon: require('./googleplus.svg'),
            arrow: require('./long-arrow-right.svg')
        }
    })
}