require('./auth.scss');

module.exports = function (componentService) {
    componentService.register('auth', {
        template: require('./auth.html'),
        created: function () {
            var $el = $(this);
            var $email = $el.find('input[name="email"]');
            var $name = $el.find('input[name="name"]');
            var $registrationElements = $('[for="registration"]');
            var $loginElements = $('[for="login"]') ;
            var $showTrigger = $('[auth-trigger]');

            $('[registration-trigger]').click(function(e) {
                e.preventDefault();
                $registrationElements.prop('hidden', false)
                $loginElements.prop('hidden', true)
                $name.focus();
            });
            $showTrigger.click(function() {
                if ($(this).attr('type')=='registration') {
                    $registrationElements.prop('hidden', false)
                    $loginElements.prop('hidden', true)
                } else {
                    $registrationElements.prop('hidden', true)
                    $loginElements.prop('hidden', false)
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