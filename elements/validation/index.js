var $ = require('jquery');
var Parsley = require('parsleyjs');
Parsley.options.namespace = 'validate-';

Parsley.addValidator('equaltoFormSibling', {
    validateString: function (value, selector, field) {
        var otherField = field.$element.closest('form').find(selector).parsley()
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

window.ParsleyConfig.i18n.bg = $.extend(window.ParsleyConfig.i18n.bg || {}, {
    defaultMessage: "Невалидна стойност.",
    type: {
        email:        "Въведете точен имейл адрес.",
        url:          "Въведете точен интернет адрес (URL)",
        number:       "Въведете число.",
        integer:      "Въведете число без десетична запетая.",
        digits:       "Въведете цифри.",
        alphanum:     "Полето трябва да съдържа само букви или цифри."
    },
    notblank:           "Задължително поле.",
    required:           "Задължително поле.",
    pattern:            "Неточно въведено поле.",
    min:                "Въведете число по-голямо или равно на %s.",
    max:                "Въведете число по-малко или равно на  %s.",
    range:              "Въведете число между %s и %s.",
    minlength:          "Въведете повече от %s символа.",
    maxlength:          "Въведете по-малко от %s символа.",
    length:             "Въведете между %s и %s символа.",
    mincheck:           "Изберете поне %s от опциите.",
    maxcheck:           "Изберете най-много %s от опциите.",
    check:              "Изберете между %s и %s опции.",
    equalto:            "Не съвпада.",
    equaltoFormSibling: 'Не съвпада.'
});
Parsley.setLocale('bg');

module.exports = function (componentService) {
    var registeredElements = componentService.registered;
    componentService.on('register', handleNewElement);
    for (var elName in registeredElements) {
        handleNewElement(elName, registeredElements[elName])
    }

    componentService.register('validate-bubbles', {
        type: 'attribute',
        created: function() {
            var $form = $(this);
            if (!$form.is('form')) {
                $form = $($form[0].querySelector('form'));
                $form.parsley().on('form:error', function() {
                    var bubble = $form[0].querySelector('bubble[type=error]').cloneNode(true);
                    componentService.upgrade(bubble)
                    bubble.show()
                })
            }
        }
    })
};

/*
 * Checks for registered custom elements that have a `value` property (i.e. can be treated as inputs)
 * and declares them as possible inputs in the validation mechanism
 */
var handleNewElement = function (name, def) {
    if (def.customPropertyNames && def.customPropertyNames.indexOf('value') > -1) {
        Parsley.options.inputs += ', ' + name;
        Parsley.options.excluded += ', ' + name + ' input' + ', ' + name + ' select' + ', ' + name + ' textarea';
    }
};