module.exports = function (componentService) {

    componentService.register('auth-trigger', {
        type: 'attribute',
        created: function () {
            var $trigger = $(this);
            var target = $trigger.attr('href');
            var $authModal = !target ? $trigger.closest('[auth-modal]') : $($trigger.attr('href'));
            var authModal = $authModal[0];
            var isRegistration = $trigger.attr('type') == 'registration';
            var registrationPatch = authModal.querySelector('auth-modal-patch[for="registration"]');
            var loginPatch = authModal.querySelector('auth-modal-patch[for="login"]');

            $trigger.click(function (e) {
                e.preventDefault();
                if (isRegistration) {
                    if (registrationPatch) registrationPatch.applyTo(authModal);
                    authModal.type = 'registration';
                } else {
                    if (loginPatch) loginPatch.applyTo(authModal);
                    authModal.type = 'login';
                }
            });
        }
    });
};