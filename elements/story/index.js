require('./story.scss')

module.exports = function (componentService) {
    componentService.register('story', {
        template: require('./story.html')
    })
}