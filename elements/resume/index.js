require('./resume.scss')

module.exports = function (componentService) {
    componentService.register('resume', {
        template: require('./resume.html'),
        include: {
            tagsIcon: require('./icon-tags.svg')
        }
    })
}