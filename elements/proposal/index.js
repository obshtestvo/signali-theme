var $ = require('jquery');
var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');
require('./proposal.scss');

function adjustAjaxContainers(el) {
    var proposalContainer = $(el).closest('[proposal-container]')[0];
    if (!proposalContainer) return;
    var $interactionContainer = $(proposalContainer.querySelector('[animation-container]'));
    var $replaceableElement =$interactionContainer.find('[content]').eq(0);
    el.ajaxForm.setInteractionContainer($interactionContainer)
    el.ajaxForm.setReplaceableElement($replaceableElement)
}

module.exports = function (componentService) {
    componentService.register('proposal', {
        template: require('./proposal.html'),
        created: function() {
            var el = this;
            var $el = $(el);
            var $form = $el.find('form');
            $(el).closest('[proposal-container]').on('modal:open', function(){
               $form.find('input:visible').eq(0).focus()
            });

            var validation = new ValidationForm($form);
            el.ajaxForm = new AjaxForm($form, {
                pjax: true
            });
            validation.on('form:submit', function() {
                el.ajaxForm.submit()
                return false;
            });
        },
        attached: function() {
            if (!this.ajaxForm) return;
            adjustAjaxContainers(this);
        }
    })
}