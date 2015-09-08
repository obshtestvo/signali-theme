require('./filters.scss')

module.exports = function (componentService) {
    componentService.register('filters', {
        template: require('./filters.html'),
        include: {
            plusIcon: require('./plus-square.svg'),
            minusIcon: require('./minus-square.svg')
        },
        created: function() {
            var el = this,
                $collapseTrigger = $(el.querySelector('div'));

            $collapseTrigger.on('click', function() {
                if (el.hasAttribute('collapsed')) {
                    el.removeAttribute('collapsed')
                } else {
                    el.setAttribute('collapsed', '')
                }
            })
        }
    })
}