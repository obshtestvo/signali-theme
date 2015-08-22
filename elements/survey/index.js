require('./survey.scss')

module.exports = function (componentService) {
    componentService.register('survey', {
        template: require('./survey.html')
    })
}