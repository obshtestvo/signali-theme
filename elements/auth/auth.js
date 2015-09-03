var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');
var request = require('ajax/request');

module.exports = function (componentService) {
    componentService.register('auth', {
        template: require('./auth.html'),
        created: function () {
            var el = this,
                $el = $(el),
                $userControls = $(el.getAttribute('auth-replace')),
                $form = $el.find('form');

            el.validation = new ValidationForm($form);
            el.ajaxForm = new AjaxForm($form, {
                interactionContainer: $form.closest('[auth-container]'),
                success: function(data) {
                    $('auth-current-user input').val(data.user.pk)
                    request.pjax(data.user.URI, function(newUserControls) {
                        $userControls.replaceWith(newUserControls)
                    });

                    var event = $.Event('auth:success');
                    $el.trigger(event, [data, el.ajaxForm]);
                    if (event.isDefaultPrevented()) return false;

                    if (data.backend == 'email' && data.is_new) {
                        event = $.Event('auth:registration:success');
                        $el.trigger(event, [data, el.ajaxForm]);
                        if (event.isDefaultPrevented()) return false;

                        request.pjax(data.redirect, function(message) {
                            var $result = el.ajaxForm.options.applyResult(ajaxForm, true, message);
                            el.ajaxForm.showResult($result);
                        });
                    } else {
                        event = $.Event('auth:login:success');
                        $el.trigger(event, [data, el.ajaxForm]);
                        if (event.isDefaultPrevented()) return false;

                        el.ajaxForm.unblock();
                        el.bubble()
                    }
                    return false;
                }
            });
            el.validation.disableGroupsExcept(el.type);
            el.validation.on('form:submit', function () {
                el.ajaxForm.submit();
                return false;
            });
        },
        attached: function() {
            this.ajaxForm.setInteractionContainer($(this).closest('[auth-container]'))
        },
        properties: {
            type: {
                attr: true,
                set: function (value) {
                    var $el = $(this);
                    if (this.validation) {
                        this.validation.clearServerErrors();
                        this.validation.disableGroupsExcept(value)
                    }
                    if (value == 'registration') {
                        $el.find('[for="registration"]').show();
                        $el.find('[for="login"]').hide();
                        $el.find('input[name="name"]').focus();
                        $el.find('input[name="auth_type"]').val('registration');
                    } else {
                        $el.find('[for="login"]').show();
                        $el.find('[for="registration"]').hide();
                        $el.find('input[name="email"]').focus();
                        $el.find('input[name="auth_type"]').val('login');
                    }
                    return value;
                }
            }
        },
        prototype: {
            setInput: function (name, value) {
                var $el = $(this);
                var $input = $el.find('input[name="' + name + '"]');
                if (!$input.length) {
                    $input = $('<input type="hidden" name="' + name + '">').appendTo($el.find('form'));
                }
                $input.val(value);
            },
            focus: function () {
                var $el = $(this);
                var $email = $el.find('input[name="email"]');
                var $name = $el.find('input[name="name"]');
                if ($email.is(":visible")) $email.focus();
                if ($name.is(":visible")) $name.focus();
            },
            cancel: function () {
                this.ajaxForm.unblock();
                $(this).trigger('auth:cancel')
            },
            bubble: function (bubbleEl) {
                if (!bubbleEl) bubbleEl = this.querySelector('bubble[success]')
                bubbleEl.show()
            }
        }
    });
};