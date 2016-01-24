import 'parsleyjs';
import $ from 'jquery';

window.ParsleyConfig.i18n.bg = $.extend(window.ParsleyConfig.i18n.bg || {}, {
    defaultMessage: 'Невалидна стойност.',
    type: {
        email:        'Въведете точен имейл адрес.',
        url:          'Въведете точен интернет адрес (URL)',
        number:       'Въведете число.',
        integer:      'Въведете число без десетична запетая.',
        digits:       'Въведете цифри.',
        alphanum:     'Полето трябва да съдържа само букви или цифри.'
    },
    notblank:           'Задължително поле.',
    required:           'Задължително поле.',
    pattern:            'Неточно въведено поле.',
    min:                'Въведете число по-голямо или равно на %s.',
    max:                'Въведете число по-малко или равно на  %s.',
    range:              'Въведете число между %s и %s.',
    minlength:          'Въведете повече от %s символа.',
    maxlength:          'Въведете по-малко от %s символа.',
    length:             'Въведете между %s и %s символа.',
    mincheck:           'Изберете поне %s от опциите.',
    maxcheck:           'Изберете най-много %s от опциите.',
    check:              'Изберете между %s и %s опции.',
    equalto:            'Не съвпада.',
    equaltoFormSibling: 'Не съвпада.'
});