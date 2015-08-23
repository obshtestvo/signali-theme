require('./list-item.scss')

module.exports = function (componentService) {
    componentService.register('list-item', {
        template: require('./list-item.html'),
        include: {
            checkCircle: require('./check-circle.svg'),
            closeCircle: require('./close.svg')
        },
        properties: {
            "check": {
                get: function () {
                    return this.getAttribute('type')=='check'
                }
            },
            "none": {
                get: function () {
                    return this.getAttribute('type')=='none'
                }
            }
        }
    })
}