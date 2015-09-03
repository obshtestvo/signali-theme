var $ = require('jquery');
var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');
require('./proposal.scss');

module.exports = function (componentService) {
    componentService.register('proposal', {
        template: require('./proposal.html'),
        created: function() {
            var el = this;
            var $el = $(el);
            var $form = $el.find('form');

            var validation = new ValidationForm($form);
            var ajaxForm = new AjaxForm($form, {
                pjax: true,
                interactionContainer: $form.closest('[proposal-container]')
            });
            validation.on('form:submit', function() {
                ajaxForm.submit()
                return false;
            });
        }
    })
}