require('./fader.scss')

module.exports = function (componentService) {
    componentService.register('fader', {
        template: require('./fader.html')
    })
}