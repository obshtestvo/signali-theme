require('./text-field.scss')

module.exports = function (componentService) {
    componentService.register('text-field', {
        template: require('./text-field.html'),
        properties: {
            "textarea": {
                get: function () {
                    return this.getAttribute('type')=='textarea'
                }
            },
            "value": {
                get: function () {
                    var $el = $(this);
                    var $input = $el.find('input, textarea');
                    return $input.val()
                }
            },
            "validate-trigger": {
                get: function() {
                    return 'input keyup'
                }
            }
        }
    })
};