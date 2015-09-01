var toggleFixedHeight = require('service/toggleFixedHeight.js');
require('service/jquery.animateContentSwitch.js');

module.exports = function (componentService) {
    componentService.register('auth-required', {
        type: 'attribute',
        created: function () {
            var el = this,
                $form = el.tagName == 'FORM' ? $(el) : $(el.querySelector('form'));

            $form.on('ajax-submit.auth-required submit.auth-required', function (e) {
                e.preventDefault();
                if (!el.authContainer) {
                    el.authContainer = attachAuthContainer(el);
                    var $auth = $(el.authContainer).find('auth');
                    $auth.on('auth:success', function (e, data) {
                        document.querySelector('[auth-required]').clearAuthRequirement();
                        var authScenario = data.is_new ? 'registration' : 'login';
                        $form.append($('<input type="hidden" name="ui_include_auth">').val(authScenario));
                        hideAuthContainer(el, function() {
                            //@todo slide back (contentSwitch) to previous form, after animation, start spinning the wheel,
                            $form.submit();
                        })
                    });
                    $auth.on('auth:registration:success', function (e, data, ajaxForm) {
                        e.preventDefault();
                    })
                }
                showAuthContainer(el)
            });
        },

        prototype: {
            clearAuthRequirement: function() {
                var $form = this.tagName == 'FORM' ? $(this) : $(this.querySelector('form'));
                $form.off('.auth-required');
                this.removeAttribute('auth-required')
            }
        }
    });
};

var hideAuthContainer = function(el, callback) {
    if (el.tagName == 'MODAL') {
        var $el = $(el);
        toggleFixedHeight($el, true);
        $el.animateContentSwitch($(el.authContainer), $(el.primary), {
            speed: 300,
            width: false,
            final: function () {
                toggleFixedHeight(self.$container, false);
                callback()
            }
        });
    } else {
        var $authContainer = $(el.authContainer);
        $authContainer.on('modal:close.auth-required.autoclose', function() {
            $authContainer.off('.auth-required.autoclose');
            callback()
        });
        el.authContainer.close();
    }
};

var showAuthContainer = function(el) {
    if (el.tagName == 'MODAL') {
        var $el = $(el),
            auth = $(el.authContainer).find('auth')[0];
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