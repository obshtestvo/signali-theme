require('./action-button.scss')

module.exports = function (componentService) {
    componentService.register('action-button', {
        template: require('./action-button.html'),
        include: {
            "arrow": require('./chevron-circle-right.svg'),
            "arrow-back": require('./chevron-circle-left.svg'),
            "reply-icon": require('./reply.svg')
        },
        properties: {
            action: {
                attr: true,
                set: function(value) {
                    $(this).find('a').attr('href', value);
                }
            },
            target: {
                attr: true,
                set: function(value) {
                    $(this).find('a').attr('target', value);
                }
            }
        }
    })
}