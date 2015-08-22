require('./survey-question.scss')

module.exports = function (componentService) {
    componentService.register('survey', {
        template: require('./survey-question.html')
    })
}