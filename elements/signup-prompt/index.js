var $ = require('jquery');
var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');

module.exports = function (componentService) {
    componentService.register('signup-prompt', {
        template: require('./signup-prompt.html'),
        created: function() {
            var el = this;
            var $this = $(this);
            var redirect = this.querySelector('redirect');
            var $form = $this.find('form');
            var $formControls = $form.find('input, button');

            $form.find('input, button').on('focus.signupprompt keyup.signupprompt click.signupprompt', function() {
                redirect.pause()
            });


            var validation = new ValidationForm($form);
            var ajaxForm = new AjaxForm($form, {
                interactionContainer: $form.closest('modal'),
                success: function() {
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
        },
        detached: function() {
            console.log('detache')
        }
    })
};
