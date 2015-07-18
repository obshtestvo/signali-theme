require('./textarea-field.scss')

module.exports = function (componentService) {
    componentService.register('textarea-field', {
        template: require('./textarea-field.html')
    })
}