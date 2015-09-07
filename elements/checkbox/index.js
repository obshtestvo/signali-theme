require('./checkbox.scss');

module.exports = function (componentService) {
    componentService.register('checkbox', {
        template: require('./checkbox.html'),
        include: {
            tick: require('./tick.svg')
        },
        properties: {
            "empty-value": {
                get: function() {
                    return this.getAttribute('value') == ''
                }
            }
        }
    })
}