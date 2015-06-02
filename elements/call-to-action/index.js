require('./call-to-action.scss');

module.exports = function (componentService) {
    componentService.register('call-to-action', {
        template: require('./call-to-action.html')
    })
};