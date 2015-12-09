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
                $form = $el.find('form'),
                success = function(e, data, ignoreNew) {
                    if (el.type == 'reset') {
                        event = $.Event('auth:reset');
                        $el.trigger(event, [data, el.ajaxForm]);
                        if (event.isDefaultPrevented()) return false;
                        el.ajaxForm.unblock();
                        $el.find('[for="reset"] notification[success], [for="reset"] notification[information]').show()
                        if (el.hasResetBefore) el.bubble();
                        el.hasResetBefore = true;
                        return false;
                    }
                    $('auth-current-user input').val(data.user.pk);
                    request.pjax(data.user.URI, function(newUserControls) {
                        $userControls.replaceWith(newUserControls)
                    });

                    var event = $.Event('auth:success');
                    $el.trigger(event, [data, el.ajaxForm]);
                    if (event.isDefaultPrevented()) return false;

                    if (data.backend == 'email' && data.is_new && !ignoreNew) {
                        event = $.Event('auth:registration:success');
                        $el.trigger(event, [data, el.ajaxForm]);
                        if (event.isDefaultPrevented()) return false;

                        request.pjax(data.redirect, function(message) {
                            var $result = el.ajaxForm.options.applyResult(el.ajaxForm, true, message);
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
                };

            $el.on('auth:complete', success);
            el.validation = new ValidationForm($form);
            el.ajaxForm = new AjaxForm($form, {
                success: function(data) {
                    return success(null, data)
                },
                error: function() {
                    el.ajaxForm.unblock();
                }
            });
            el.validation.disableGroupsExcept(el.type);
            el.validation.on('form:submit', function () {
                el.ajaxForm.submit();
                return false;
            });
        },

        attached: function() {
            if (this.ajaxForm) {
                this.ajaxForm.setInteractionContainer(this.getAnimationContainer())
            }
        },

        properties: {
            type: {
                attr: true,
                set: function (value) {
                    var $el = $(this);
                    var $form = $(this.querySelector('form'))
                    if (this.validation) {
                        this.validation.clearServerErrors();
                        this.validation.disableGroupsExcept(value)
                    }
                    if (value == 'registration') {
                        $el.find('input[name="fullname"]').focus();
                        $el.find('input[name="auth_type"]').val('registration');
                        $form.attr('action', $el.attr('complete-action'))
                    } else if (value == 'login') {
                        $el.find('input[name="auth_type"]').val('login');
                        $form.attr('action', $el.attr('complete-action'))
                        $el.find('input[name="email"]').focus();
                    } else {
                        $el.find('input[name="auth_type"]').val('reset');
                        $form.attr('action', $el.attr('reset-action'))
                        $el.find('input[name="email"]').focus();
                    }
                    return value;
                }
            }
        },

        prototype: {
            getAnimationContainer: function() {
                var $animationContainer,
                    $container  = $(this).closest('[auth-container]');
                if (!$container.is('[animation-container]')) {
                    $animationContainer = $($container[0].querySelector('[animation-container]'))
                    if ($animationContainer.length) $container = $animationContainer;
                }
                return $container;
            },
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
                var $name = $el.find('input[name="fullname"]');
                if ($email.is(":visible")) $email.focus();
                if ($name.is(":visible")) $name.focus();
            },
            cancel: function () {
                this.ajaxForm.unblock();
                $(this).trigger('auth:cancel')
            },
            bubble: function (bubbleEl) {
                if (!bubbleEl) bubbleEl = this.querySelector('bubble[type="success"][auth-type="'+this.type+'"]').cloneNode(true)
                componentService.upgrade(bubbleEl)
                bubbleEl.show()
            }
        }
    });
};