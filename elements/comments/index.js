require('./comments.scss')

module.exports = function (componentService) {
    componentService.register('comments', {
        template: require('./comments.html')
    })
}