import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import request from 'ajax/request';

export default class {
    static displayName = 'password-reset';

    static attached (el) {
        if (el.ajaxForm) {
            adjustAjaxContainers(el);
        }
        if (el.hasBeenAttached) return;
        var $el = $(el),
            $form = $el.find('form');
        if (!$form.length) return;
        el.hasBeenAttached = true;

        console.log('aasdasd');
        el.validation = new ValidationForm($form);
        el.ajaxForm = new AjaxForm($form, {
            pjax: true
        });
        el.validation.on('form:submit', function () {
            el.ajaxForm.submit();
            return false;
        });
    }


    /* @todo extract method as a class AnimatableMixin */
    getAnimationContainer () {
        if (!$container.is('[animation-container]')) {
            $animationContainer = $($container[0].querySelector('[animation-container]'));
            if ($animationContainer.length) $container = $animationContainer;
        }
        return $container;
    }
}
function adjustAjaxContainers(el) {
    el.ajaxForm.setInteractionContainer($(el).closest('[animation-container]'));
    el.ajaxForm.setReplaceableElement($(el).closest('[animation-content]'))
}