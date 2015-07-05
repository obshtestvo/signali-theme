require('./list-item.scss')

module.exports = function (componentService) {
    componentService.register('list-item', {
        template: require('./list-item.html'),
        include: {
            checkCircle: require('./check-circle.svg')
        }
    })
}