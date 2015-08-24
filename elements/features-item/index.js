require('./features-item.scss')

module.exports = function (componentService) {
    componentService.register('features-item', {
        template: require('./features-item.html'),
        include: {
            checkCircle: require('./check-circle.svg'),
            closeCircle: require('./close.svg'),
            questionCircle: require('./question.svg')
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
            },
            "question": {
                get: function () {
                    return this.getAttribute('type')=='question'
                }
            }
        }
    })
}