import $ from 'jquery';
import Parsley from 'parsleyjs';
import './i18n.bg';

Parsley.options.namespace = 'validate-';
Parsley.setLocale('bg');

Parsley.addValidator('equaltoFormSibling', {
    validateString: function (value, selector, field) {
        var otherField = field.$element.closest('form').find(selector).parsley();
        return value == otherField.getValue()
    }
});

Parsley.addValidator('server', {
    validateString: function (value, selector, field) {
        return !Boolean(field.serverError)
    },
    validateMultiple: function (value, selector, field) {
        return !Boolean(field.serverError)
    }
});

export class ValidateBubblesAttribute {
    static displayName = 'validate-bubbles';
    static type = 'attribute';

    static attached (el) {
        if (el.hasBeenAttached) return;
        var $form = $(el);
        if (!$form.is('form')) {
            $form = $($form[0].querySelector('form'));
        }
        if (!$form.length) return;
        el.hasBeenAttached = true;
        $form.parsley().on('form:error', function() {
            var bubble = $form[0].querySelector('bubble[type=error]').clone();
            bubble.show()
        })
    }
}

/*
 * Checks for registered custom elements that have a `value` property (i.e. can be treated as inputs)
 * and declares them as possible inputs in the validation mechanism
 */
var handleNewElement = function (name, def) {
    if (def.properties && 'value' in def.properties) {
        Parsley.options.inputs += ', ' + name;
        Parsley.options.excluded += ', ' + name + ' input' + ', ' + name + ' select' + ', ' + name + ' textarea';
    }
};

export function enableValidationForNonNativeInputs(componentService) {
    componentService.on('register', handleNewElement);
    for (let elName in componentService.registered) {
        handleNewElement(elName, componentService.registered[elName])
    }
}