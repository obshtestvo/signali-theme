require('./modal.scss')

module.exports = function (componentService) {
    componentService.register('modal', {
        template: require('./modal.html')
    })
}