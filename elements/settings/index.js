require('./settings.scss');
var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');

module.exports = function (componentService) {
    componentService.register('settings', {
        template: require('./settings.html'),
        created: function() {
            var el = this,
                $el = $(el),
                $form = $el.find('form'),
                $password1 = $(el.querySelector('[name="new_password1"]')),
                $password2 = $(el.querySelector('[name="new_password2"]')),
                $nameInput = $el.find('input[name="fullname"]'),
                $passwordInputs = $el.find('[type="password"]');

            $el.closest('modal').on('modal:open', function() {
                $nameInput.focus();
            });

            $el.find('[href="#generalSettings"]').on('click', function() {
                $passwordInputs.val('')
            });

            var validation = new ValidationForm($form);

            el.ajaxForm = new AjaxForm($form, {
                success: function() {
                    el.ajaxForm.unblock();
                    el.bubble()
                    return false;
                }
            });

            validation.on('form:submit', function() {
                el.ajaxForm.submit();
                return false;
            });

            $password1.on('keyup change', function() {
                $password2.parsley().validate()
            });
        },
        prototype: {
            bubble: function (bubbleEl) {
                if (!bubbleEl) bubbleEl = this.querySelector('bubble[success]').cloneNode(true)
                componentService.upgrade(bubbleEl)
                bubbleEl.show()
            }
        }
    });
};