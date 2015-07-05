require('./resume.scss')

module.exports = function (componentService) {
    componentService.register('resume', {
        template: require('./resume.html')
    })
}