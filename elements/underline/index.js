require('./underline.scss')

module.exports = function (componentService) {
    componentService.register('underline', {
        template: require('./underline.html'),
        include: {
            underline: require('./underline.svg')
        }
    })
}