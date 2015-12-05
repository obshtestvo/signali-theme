module.exports = function (componentService) {

    componentService.register('auth-trigger', {
        type: 'attribute',
        created: function () {
            var $trigger = $(this);
            var target = $trigger.attr('href');
            var type = $trigger.attr('type');
            $trigger.click(function (e) {
                var $authContainer = !target ? $trigger.closest('[auth-container]') : $(target);
                var authContainer = $authContainer[0];
                var registrationPatch = authContainer.querySelector('auth-container-patch[for="registration"]');
                var loginPatch = authContainer.querySelector('auth-container-patch[for="login"]');
                var resetPatch = authContainer.querySelector('auth-container-patch[for="reset"]');
                e.preventDefault();
                if (type == "registration") {
                    if (registrationPatch) registrationPatch.applyTo(authContainer);
                    authContainer.type = 'registration';
                } else if (type == "login") {
                    if (loginPatch) loginPatch.applyTo(authContainer);
                    authContainer.type = 'login';
                } else {
                    if (loginPatch) resetPatch.applyTo(authContainer);
                    authContainer.type = 'reset';
                }
            });
        }
    });
};