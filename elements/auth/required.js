var toggleFixedHeight = require('service/toggleFixedHeight.js');
require('service/jquery.animateContentSwitch.js');

module.exports = function (componentService) {
    componentService.register('auth-required', {
        type: 'attribute',
        created: function () {
            var el = this,
                $form = el.tagName == 'FORM' ? $(el) : $(el.querySelector('form'));


            var intercept = function (e) {
                e.preventDefault();
                if (!el.authContainer) {
                    el.authContainer = attachAuthContainer(el);
                    $(el.authContainer).find('auth').on('auth:success', function () {
                        //@todo on auth:success -> fetch all elements with auth-required, loop, removeRequirement() - remove attribute
                        //@todo slide back (contentSwitch) to previous form, after animation, start spinning the wheel,
                        //@todo remove event listener
                        //@todo append input to the form, depending whether it's a registration or login
                        //@todo the new input should be called "ui_include_auth"="login|registration"
                    })
                }
                showAuthContainer(el)
            };

            $form.on('ajax-submit submit', intercept);
        }
    });
};

var showAuthContainer = function(el) {
    if (el.tagName == 'MODAL') {
        var $el = $(el),
            auth = $el.find('auth')[0];
        toggleFixedHeight($el, true);
        $el.animateContentSwitch($(el.primary), $(el.authContainer), {
            speed: 300,
            width: false,
            final: function () {
                toggleFixedHeight(self.$container, false);
                auth.focus()
            }
        });
    } else {
        el.authContainer.show();
    }
};

var attachAuthContainer = function(el) {
    var authModal = document.querySelector('[auth-modal="main"]').cloneAuthModal(el.getAttribute('auth-id'));
    var modalPatch = el.querySelector('auth-modal-patch');
    if (el.tagName == 'MODAL') {
        if (modalPatch) modalPatch.applyTo(authModal);
        var authContainer = authModal.primary,
            $authContainer = $(authContainer);
        $authContainer.hide();
        el.addSecondary(authContainer);
        return authContainer;
    } else {
        authModal.attach();
        if (modalPatch) modalPatch.applyTo(authModal);
        return authModal;
    }
};