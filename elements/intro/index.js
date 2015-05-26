require('./intro.scss')

module.exports = function (componentService) {
    componentService.register('intro', {
        template: require('./intro.html')
    })
}