require('./checkbox.scss');

module.exports = function (componentService) {
    componentService.register('checkbox', {
        template: require('./checkbox.html'),
        include: {
            tick: require('./tick.svg')
        }
    })
}