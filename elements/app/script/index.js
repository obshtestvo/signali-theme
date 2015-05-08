require('app/style/app.scss');

// jquery plugins are not yet all used to CommonJS
window.$ = window.jQuery = require('jquery/dist/jquery');
var ComponentService = require('service/pseudo-webcomponent.skate');
var componentService = new ComponentService();

var coverElement = require('cover');
coverElement(componentService)

var googleAnalyticsElement = require('google-analytics');
googleAnalyticsElement(componentService)

//var actionButtonEl = require('action-button');
//actionButtonEl(componentService)
//
var checkboxEl = require('checkbox');
checkboxEl(componentService)

var radioEl = require('radio-button');
radioEl(componentService)

var selectEl = require('select-dropdown');
selectEl(componentService)