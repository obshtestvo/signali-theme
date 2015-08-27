require('ajax');
require('./auth.scss');

module.exports = function (componentService) {
    componentService.register('auth', {
        template: require('./auth.html'),
        created: function () {
            var $el = $(this);
            var $email = $el.find('input[name="email"]');
            var $name = $el.find('input[name="name"]');
            var $registrationElements = $('[for="registration"]');
            var $loginElements = $('[for="login"]');
            var $showTrigger = $('[auth-trigger]');

            $('[registration-trigger]').click(function(e) {
                e.preventDefault();
                $registrationElements.show()
                $loginElements.hide()
                $name.focus();
            });
            $showTrigger.click(function() {
                if ($(this).attr('type')=='registration') {
                    $registrationElements.show()
                    $loginElements.hide()
                } else {
                    $registrationElements.hide()
                    $loginElements.show()
                }
            });
            $showTrigger.on('done', function() {
                if ($(this).attr('type')=='registration') {
                    $name.focus();
                } else {
                    $email.focus();
                }
            });
        }
    });
};