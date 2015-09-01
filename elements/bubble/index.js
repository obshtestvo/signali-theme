require('./bubble.scss')

module.exports = function (componentService) {
    componentService.register('bubble', {
        template: require('./bubble.html'),
        include: {
            iconCheck: require('./check-circle.svg'),
            iconExclamation: require('./exclamation-circle.svg'),
            iconInfo: require('./info-circle.svg'),
            iconClose: require('./close.svg')
        },
        properties: {
            "information": {
                get: function () {
                    return this.getAttribute('type')=='information'
                }
            },
            "success": {
                get: function () {
                    return this.getAttribute('type')=='success'
                }
            },
            "error": {
                get: function () {
                    return this.getAttribute('type')=='error'
                }
            }
        },
        prototype: {
            show: function () {
                document.querySelector('body').appendChild(this);
                $(this).show()
            }
        }
    })
}