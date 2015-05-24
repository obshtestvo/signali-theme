require('./logo.scss')

module.exports = function (componentService) {
    componentService.register('logo', {
        template: require('./logo.html'),
        include: {
            logo: require('./logo.svg')
        }
    })
}