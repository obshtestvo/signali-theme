require('./text-field.scss')

module.exports = function (componentService) {
    componentService.register('text-field', {
        template: require('./text-field.html'),
        properties: {
            "textarea": {
                get: function () {
                    return this.getAttribute('type')=='textarea'
                }
            }
        }
    })
};