require('./filters.scss')

module.exports = function (componentService) {
    componentService.register('filters', {
        template: require('./filters.html'),
        include: {
            plusIcon: require('./plus-square.svg'),
            minusIcon: require('./minus-square.svg')
        }
    })
}