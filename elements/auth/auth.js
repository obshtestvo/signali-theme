var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');

module.exports = function (componentService) {
    componentService.register('auth', {
        template: require('./auth.html'),
        created: function () {
            var $el = $(this);
            var $form = $el.find('form');

            this.validation = new ValidationForm($form);
            var ajaxForm = new AjaxForm($form, {
                containerAscendantSelector: '[auth-container]',
                preventShow: true,
                success: function(data) {
                    $el.trigger('auth:success', [data]);
                    //@todo query (pjax) data.user.URI
                    //@todo replace login-box with query response
                    return false;
                }
            });
            this.validation.disableGroupsExcept(this.type);
            this.validation.on('form:submit', function () {
                ajaxForm.submit();
                return false;
            });
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
                $(this).trigger('auth:cancel')
            }
        }
    });
};