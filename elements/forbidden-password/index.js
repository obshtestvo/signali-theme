require('./forbidden-password.scss');

module.exports = function (componentService) {
    componentService.register('forbidden-password', {
        template: require('./forbidden-password.html')
    })
};