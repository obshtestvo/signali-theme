require('./input-field.scss')

module.exports = function (componentService) {
    componentService.register('input-field', {
        template: require('./input-field.html')
    })
}