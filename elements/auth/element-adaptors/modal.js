$ = require('jquery');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
require('service/jquery.animateContentSwitch.js');



var overrideAjaxResult = function(ajaxForm) {
    //var originalApply = ajaxForm.options.applyResult;
    //ajaxForm.options.applyResult = function(instance, isSuccess, content) {
    //    debugger;
    //    var $result = originalApply.apply(this, arguments);
    //    $result.wrap("<modal-screen></modal-screen>");
    //    var $screen = $result.parent();
    //    $screen.hide();
    //    $result.show();
    //    return $screen
    //}
};


var registration = function (componentService) {

    componentService.register('auth-removes-modal', {
        type: 'attribute',
        created: function() {
            var el = this,
                $el = $(el),
                handler;

            var modalTriggerHandler = function() {
                var $affected = $el.add($el.find('[target=modal]'))
                $affected.off('.modal-target');
            };

            if ($el.is('[target=modal]')) {
                handler = modalTriggerHandler;
            }
            if (handler) {
                $(document).on('auth:success', handler)
            }
        }
    });

    componentService.register('auth-change-attrs', {
        type: 'attribute',
        created: function() {
            var el = this;

            var attrs = JSON.parse(el.getAttribute('auth-change-attrs'));
            if (!attrs || (attrs && !attrs.length)) return;

            $(document).on('auth:success', function() {
                for (var i=0; i < attrs.length; i++) {
                    var attrName = attrs[i];
                    el.setAttribute(attrName, el.getAttribute('auth-'+attrName))
                }
            })
        }
    });

    componentService.register('auth-modal-container', {
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

            $auth.on('auth:success', function (e, data, ajaxForm) {
                $el.off('modal:close', cancelAuth);
                overrideAjaxResult(ajaxForm);
                ajaxForm.setReplaceableElement($(el.primary));
            });
            $auth.on('auth:login:success', function () {
                el.close()
            });
            $el.on('modal:open', function () {
                el.auth.focus()
            });
            $el.on('modal:close', cancelAuth);
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
        attach: function(el, componentService) {
            var authModal = document.querySelector('modal[auth-container="main"]').cloneAuthModal(el.getAttribute('auth-id'));
            var modalPatch = el.querySelector('auth-container-patch');
            if (el.tagName == 'MODAL') {
                if (modalPatch) modalPatch.applyTo(authModal);
                var authContainer = authModal.primary,
                    $authContainer = $(authContainer);
                authContainer.setAttribute('auth-container', 'secondary');
                componentService.upgrade(authContainer);
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

        dismiss: function(el, callback, originalAjaxForm, forceShowForm) {
            if (el.tagName == 'MODAL') {
                if (!forceShowForm) {
                    overrideAjaxResult(originalAjaxForm)
                    originalAjaxForm.setReplaceableElement($(el.authContainer))
                    callback()
                    return;
                }
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