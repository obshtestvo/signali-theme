var $ = require('jquery');

module.exports = function (componentService) {
    componentService.register('signup-prompt', {
        template: require('./signup-prompt.html'),
        created: function() {
            var $this = $(this);
            var redirect = this.querySelector('redirect');
            var $form = $this.find('form');

            $form.find('input').on('focus keyup', function() {
                redirect.pause()
            });
        }
    })
};
