var $ = require('jquery');
require('block-ui');

/*
* Sensible defaults for block UI
*/
if ($.blockUI) {
    $.blockUI.defaults.css = {};
    $.blockUI.defaults.overlayCSS =  {
        backgroundColor: '#09232c',
        opacity:         0.95,
        cursor:          'wait'
    }
}