require('./textarea-field.scss')

module.exports = function (componentService) {
    componentService.register('textarea-field', {
        template: require('./textarea-field.html'),
        created: function () {
            console.log('this.is_textarea')
            console.log(this.is_textarea)
        },
        properties: {
            is_textarea: {
                get: function () {
                    return this.getAttribute('type')=='textarea'
                },
                type: Boolean,
                value: false
            }
        }
    })
};