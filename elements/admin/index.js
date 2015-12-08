// new 4.0 Select2:
//require('select2/dist/js/select2');
//require('select2/dist/css/select2.css');
//require('select2/dist/js/i18n/bg.js');

// bug with jquery versions for select element
var isEditPage = Boolean($('body.change-form').length)
if (isEditPage) {
    window.jQuery = django.jQuery.noConflict(true);
    window.$ = window.jQuery
}

require('Select2/select2.css');
require('./admin.scss');

require('Select2/select2.js');
require('Select2/select2_locale_bg');
//require('./admin_i18n.js');

require('./select2dropdowns.js');
//require('./dismissAddAnotherPopup.js');
require('./inline.js');