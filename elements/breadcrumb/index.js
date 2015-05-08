require('./breadcrumb.scss')

module.exports = function (componentService) {
    componentService.register('breadcrumb', {
        template: require('./breadcrumb.html')
    })
}