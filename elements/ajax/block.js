var $ = require('jquery');
require('block-ui');
require('./block.scss');
/*
 * Reset default css so that it can be styled with css
 */
$.blockUI.defaults.message = null;
$.blockUI.defaults.css = {};
$.blockUI.defaults.overlayCSS =  {}