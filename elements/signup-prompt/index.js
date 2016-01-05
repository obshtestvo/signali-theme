import $ from 'jquery';
import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import template from './signup-prompt.html'

export default class {
    static displayName = 'signup-prompt';
    static template = template;
    
    static ready (el) {
        var $this = $(el);
        var redirect = el.querySelector('redirect');
        var $form = $this.find('form');
        var $formControls = $form.find('input, button');

        $form.find('email-signup').on('click.signupprompt', function() {
            redirect.pause()
        });
        $form.find('input, button').on('focus.signupprompt keyup.signupprompt', function() {
            redirect.pause()
        });


        var validation = new ValidationForm($form);
        var ajaxForm = new AjaxForm($form, {
            interactionContainer: $form.closest('modal'),
            success () {
                $formControls.off('.signupprompt');
                el.querySelector('bubble[success]').show()
                redirect.completeIn(2500)
                return false;
            }
        });

        validation.on('form:submit', function() {
            ajaxForm.submit()
            return false;
        });
    }
}