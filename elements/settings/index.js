import './settings.scss'
import $ from 'jquery';
import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import template from './settings.html'

export default class {
    static displayName = 'settings';
    static template = template;

    static ready (el) {
        var $el = $(el),
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
            success () {
                el.ajaxForm.unblock();
                el.bubble();
                $('[settings-name]').text($nameInput.val());
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
    }

    bubble (bubbleEl) {
        if (!bubbleEl) bubbleEl = this.querySelector('bubble[success]').clone();
        bubbleEl.show()
    }
}