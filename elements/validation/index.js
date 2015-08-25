var $ = require('jquery');
var Parsley = require('parsleyjs');
Parsley.options.namespace = 'validate-';

window.ParsleyConfig.i18n.bg = $.extend(window.ParsleyConfig.i18n.bg || {}, {
    defaultMessage: "Невалидна стойност.",
    type: {
        email:        "Въведете имейл адрес.",
        url:          "Въведете URL адрес.",
        number:       "Въведете число.",
        integer:      "Въведете число без десетична запетая.",
        digits:       "Въведете цифри.",
        alphanum:     "Полето трябва да съдържа само букви или цифри."
    },
    notblank:       "Задължително поле.",
    required:       "Задължително поле.",
    pattern:        "Неточно въведено поле.",
    min:            "Въведете число по-голямо или равно на %s.",
    max:            "Въведете число по-малко или равно на  %s.",
    range:          "Въведете число между %s и %s.",
    minlength:      "Въведете повече от %s символа.",
    maxlength:      "Въведете по-малко от %s символа.",
    length:         "Въведете между %s и %s символа.",
    mincheck:       "Изберете поне %s от опциите.",
    maxcheck:       "Изберете най-много %s от опциите.",
    check:          "Изберете между %s и %s опции.",
    equalto:        "Не съвпада."
});
Parsley.setLocale('bg');

module.exports = function (componentService) {
    var registeredElements = componentService.registered;
    componentService.on('register', handleNewElement);
    for (var elName in registeredElements) {
        handleNewElement(elName, registeredElements[elName])
    }
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