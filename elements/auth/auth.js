import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import request from 'ajax/request';
import template from './auth.html';

var Adapter;

export class AuthElement {
    static template = template;
    static displayName = 'auth';

    static attached (el) {
        if (el.ajaxForm) {
            el.ajaxForm.setInteractionContainer(el.getAnimationContainer())
        }
        if (el.hasBeenAttached) return;
        var $el = $(el),
            $userControls = $(el.getAttribute('auth-replace')),
            $form = $el.find('form');
        if (!$form.length) return;
        el.hasBeenAttached = true;
        var success = function(e, data, ignoreNew) {
                if (el.type == 'reset') {
                    event = $.Event('auth:reset');
                    $el.trigger(event, [data, el.ajaxForm]);
                    if (event.isDefaultPrevented()) return false;
                    el.ajaxForm.unblock();
                    $el.find('[for="reset"] notification[success], [for="reset"] notification[information]').show();
                    if (el.hasResetBefore) el.bubble();
                    el.hasResetBefore = true;
                    return false;
                }
                $('auth-current-user input').val(data.user.pk);
                request.pjax({
                    url: data.user.URI,
                    callback (newUserControls) {
                        $userControls.replaceWith(newUserControls)
                    }
                });

                var event = $.Event('auth:success');
                $el.trigger(event, [data, el.ajaxForm]);
                if (event.isDefaultPrevented()) return false;

                if (data.backend == 'email' && data.is_new && !ignoreNew) {
                    event = $.Event('auth:registration:success');
                    $el.trigger(event, [data, el.ajaxForm]);
                    if (event.isDefaultPrevented()) return false;

                    request.pjax({
                        url: data.redirect,
                        callback (message) {
                            var $result = el.ajaxForm.options.applyResult(el.ajaxForm, true, message);
                            el.ajaxForm.showResult($result);
                        }
                    });
                } else {
                    event = $.Event('auth:login:success');
                    $el.trigger(event, [data, el.ajaxForm]);
                    if (event.isDefaultPrevented()) return false;
                    el.ajaxForm.unblock();
                    el.bubble()
                }
                return false;
            };

        $el.on('auth:complete', success);
        el.validation = new ValidationForm($form);
        el.ajaxForm = new AjaxForm($form, {
            success (data) {
                return success(null, data)
            },
            error () {
                el.ajaxForm.unblock();
            }
        });
        el.validation.disableGroupsExcept(el.type);
        el.validation.on('form:submit', function () {
            el.ajaxForm.submit();
            return false;
        });
    }

    static properties = {
        type: {
            attribute: true,
            set (el, data) {
                var $el = $(el);
                var $form = $(el.querySelector('form'));
                if (el.validation) {
                    el.validation.clearServerErrors();
                    el.validation.disableGroupsExcept(data.newValue)
                }
                if (data.newValue == 'registration') {
                    $el.find('input[name="fullname"]').focus();
                    $el.find('input[name="auth_type"]').val('registration');
                    $form.attr('action', $el.attr('complete-action'))
                } else if (data.newValue == 'login') {
                    $el.find('input[name="auth_type"]').val('login');
                    $form.attr('action', $el.attr('complete-action'));
                    $el.find('input[name="email"]').focus();
                } else {
                    $el.find('input[name="auth_type"]').val('reset');
                    $form.attr('action', $el.attr('reset-action'));
                    $el.find('input[name="email"]').focus();
                }
                return data.newValue;
            }
        }
    };

    /* @todo extract method as a class AnimatableMixin */
    getAnimationContainer () {
        var $animationContainer,
            $container  = $(this).closest('[auth-container]');
        if (!$container.is('[animation-container]')) {
            $animationContainer = $($container[0].querySelector('[animation-container]'));
            if ($animationContainer.length) $container = $animationContainer;
        }
        return $container;
    }

    setInput (name, value) {
        var $el = $(this);
        var $input = $el.find('input[name="' + name + '"]');
        if (!$input.length) {
            $input = $('<input type="hidden" name="' + name + '">').appendTo($el.find('form'));
        }
        $input.val(value);
    }

    focus () {
        var $el = $(this);
        var $email = $el.find('input[name="email"]');
        var $name = $el.find('input[name="fullname"]');
        if ($email.is(":visible")) $email.focus();
        if ($name.is(":visible")) $name.focus();
    }

    cancel () {
        this.ajaxForm.unblock();
        $(this).trigger('auth:cancel')
    }

    bubble (bubbleEl) {
        if (!bubbleEl) bubbleEl = this.querySelector('bubble[type="success"][auth-type="'+this.type+'"]').clone();
        bubbleEl.show()
    }
}

export default {
    setAdapter (adapter) {
        Adapter = adapter;
    },
    attach (el, componentService) {
        return Adapter.attach(el, componentService);
    },
    show (el) {
        return Adapter.show(el);
    },
    dismiss (el, callback, originalAjaxForm, forceShowForm) {
        return Adapter.dismiss(el, callback, originalAjaxForm, forceShowForm);
    }
};
