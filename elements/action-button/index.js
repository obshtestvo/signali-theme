require('./action-button.scss')

module.exports = function (componentService) {
    componentService.register('action-button', {
        template: require('./action-button.html'),
        include: {
            arrow: require('./chevron-circle-right.svg')
        },
        created: function() {
            if (this.$detachedContent) {
                $(this).find('input').val(this.$detachedContent.text().trim())
            }
        }
    })
}