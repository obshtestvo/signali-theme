var request = require('ajax/request');

module.exports = function (componentService) {
    componentService.register('stat-visit', {
        type: "attribute",
        created: function() {
            var el = this,
                $el = $(el);

            $el.on('click.stat-visit', function(e) {
                request.json(el.getAttribute('stat-visit'), 'post');
                $el.off('.stat-visit');
            })
        },
        properties: {
            statUser: {
                attr: true
            }
        }
    });

};