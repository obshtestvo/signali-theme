require('./profile-settings.scss')

module.exports = function (componentService) {
    componentService.register('profile-settings', {
        template: require('./profile-settings.html')
    })
}