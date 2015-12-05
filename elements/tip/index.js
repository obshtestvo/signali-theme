require('./tip.scss')

module.exports = function (componentService) {
    componentService.register('tip', {
        template: require('./tip.html'),
        include: {
            tip: require('./tip.svg')
        },
        type: {
            attr: true,
            set: function(value) {
                $(this).find('tip').attr('type', value);
            }
        }
    });
    componentService.register('tip-text', {
    })
}