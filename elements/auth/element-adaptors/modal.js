$ = require('jquery');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
require('service/jquery.animateContentSwitch.js');


var registration = function (componentService) {

    componentService.register('auth-removes-modal', {
        type: 'attribute',
        created: function() {
            var el = this;
            $(document).on('auth:success', function() {
                //@todo unbind modal
            })
        }
    });

    componentService.register('auth-container-modal', {
        extends: 'modal',
        type: 'attribute',
        attached: function () {
            if (this.hasBeenAttached) return;
            this.hasBeenAttached = true;

            var el = this,
                $el = $(el),
                $auth = $(el.auth),
                cancelAuth = function () {
                    el.auth.cancel()
                };

            $el.on('modal:open', function () {
                el.auth.focus()
            });
            $el.on('modal:close', cancelAuth);

            $auth.on('auth:success', function (e, data, ajaxForm) {
                $el.off('modal:close', cancelAuth);
                ajaxForm.setReplaceableElement(el.primary);
            });
            $auth.on('auth:login:success', function () {
                el.close()
            });
        },
        prototype: {
            cloneAuthModal: function(id) {
                var authModal = this.cloneModal();
                if (!id) id = "";
                authModal.id = id;
                componentService.upgrade(authModal);
                authModal.reset();
                return authModal;
            }
        }
    });
};

module.exports = {
    register: registration,
    actions: {
        attach: function(el) {
            var authModal = document.querySelector('modal[auth-container="main"]').cloneAuthModal(el.getAttribute('auth-id'));
            var modalPatch = el.querySelector('auth-container-patch');
            if (el.tagName == 'MODAL') {
                if (modalPatch) modalPatch.applyTo(authModal);
                var authContainer = authModal.primary,
                    $authContainer = $(authContainer);
                authContainer.setAttribute('auth-container', 'secondary');
                $authContainer.hide();
                el.appendSecondary(authContainer, true);
                return authContainer;
            } else {
                authModal.attach();
                if (modalPatch) modalPatch.applyTo(authModal);
                return authModal;
            }
        },

        show: function(el) {
            if (el.tagName == 'MODAL') {
                var $animationContainer = $(el.querySelector('[animation-container]')),
                    auth = $(el.authContainer).find('auth')[0];
                    auth = el.authContainer.auth;
                toggleFixedHeight($animationContainer, true);
                $animationContainer.animateContentSwitch($(el.primary), $(el.authContainer), {
                    speed: 300,
                    width: false,
                    final: function () {
                        toggleFixedHeight($animationContainer, false);
                        auth.focus()
                    }
                });
            } else {
                el.authContainer.show();
            }
        },

        dismiss: function(el, callback) {
            if (el.tagName == 'MODAL') {
                var $animationContainer = $(el.querySelector('[animation-container]'));
                toggleFixedHeight($animationContainer, true);
                $animationContainer.animateContentSwitch($(el.authContainer), $(el.primary), {
                    speed: 300,
                    width: false,
                    final: function () {
                        toggleFixedHeight($animationContainer, false);
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
        }
    }
};