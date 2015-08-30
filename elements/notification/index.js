require('./notification.scss')

module.exports = function (componentService) {
    componentService.register('notification', {
        template: require('./notification.html'),
        include: {
            iconCheck: require('./check-circle.svg'),
            iconExclamation: require('./exclamation-circle.svg'),
            iconInfo: require('./info-circle.svg')
        },
        prototype: {
            clear: function () {
                $(this).find('ul,p').remove();
            },
            appendChild: function (node) {
                var innerElement = this.querySelector('.cell');
                if (innerElement) {
                    innerElement.appendChild(node);
                } else {
                    Node.prototype.appendChild.call(this, node)
                }
            }
        }
    })
}