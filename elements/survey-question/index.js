require('./survey-question.scss')

module.exports = function (componentService) {
    componentService.register('survey-question', {
        template: require('./survey-question.html')
    })
}