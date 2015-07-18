require('./comments-auth.scss')

module.exports = function (componentService) {
    componentService.register('comments-auth', {
        template: require('./comments-auth.html')
    })
}