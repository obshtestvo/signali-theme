require('./radio-button.scss');

module.exports = function (componentService) {
    componentService.register('radio-button', {
        template: require('./radio-button.html')
    })
}