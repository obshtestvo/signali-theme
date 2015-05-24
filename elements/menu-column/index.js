require('./menu-column.scss')

module.exports = function (componentService) {
    componentService.register('menu-column', {
        template: require('./menu-column.html')
    })
}

