import './proposal.scss'
import $ from 'jquery';
import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import template from './proposal.html'

export default class {
    static displayName = 'proposal';
    static template = template;

    static attached (el) {
        if (el.ajaxForm) {
            adjustAjaxContainers(el);
        }
        if (el.hasBeenAttached) return;
        var $el = $(el);
        var $form = $el.find('form');
        if (!$form.length) return;
        el.hasBeenAttached = true;
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
    }
}

function adjustAjaxContainers(el) {
    var proposalContainer = $(el).closest('[proposal-container]')[0];
    if (!proposalContainer) return;
    var $interactionContainer = $(proposalContainer.querySelector('[animation-container]'));
    var $replaceableElement =$interactionContainer.find('[content]').eq(0);
    el.ajaxForm.setInteractionContainer($interactionContainer)
    el.ajaxForm.setReplaceableElement($replaceableElement)
}