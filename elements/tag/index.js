require('./tag.scss')

module.exports = function (componentService) {
    componentService.register('tag', {
        template: require('./tag.html')
    })
}