module.exports = function (componentService) {

    componentService.register('auth-trigger', {
        type: 'attribute',
        created: function () {
            var $trigger = $(this);
            var target = $trigger.attr('href');
            var isRegistration = $trigger.attr('type') == 'registration';
            $trigger.click(function (e) {
                var $authContainer = !target ? $trigger.closest('[auth-container]') : $($trigger.attr('href'));
                var authContainer = $authContainer[0];
                var registrationPatch = authContainer.querySelector('auth-container-patch[for="registration"]');
                var loginPatch = authContainer.querySelector('auth-container-patch[for="login"]');
                e.preventDefault();
                if (isRegistration) {
                    if (registrationPatch) registrationPatch.applyTo(authContainer);
                    authContainer.type = 'registration';
                } else {
                    if (loginPatch) loginPatch.applyTo(authContainer);
                    authContainer.type = 'login';
                }
            });
        }
    });
};