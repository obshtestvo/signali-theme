require('normalize.css/normalize.css');
require('reset.scss');

// jquery plugins are not yet all used to CommonJS
window.$ = window.jQuery = require('jquery/dist/jquery');
var ComponentService = require('service/pseudo-webcomponent.skate');
var componentService = new ComponentService();

var coverElement = require('cover');
coverElement(componentService)

var topNavElement = require('top-nav');
topNavElement(componentService)

var loginBoxElement = require('login-box');
loginBoxElement(componentService)

var logoElement = require('logo');
logoElement(componentService)

var callToActionElement = require('call-to-action');
callToActionElement(componentService)

var underlineElement = require('underline');
underlineElement(componentService)

var googleAnalyticsElement = require('google-analytics');
googleAnalyticsElement(componentService)

var actionButtonEl = require('action-button');
actionButtonEl(componentService)

var breadCrumbEl = require('breadcrumb');
breadCrumbEl(componentService);

var crumbEl = require('crumb');
crumbEl(componentService)

var tabsNavEl = require('tabs-nav');
tabsNavEl(componentService)

var checkboxEl = require('checkbox');
checkboxEl(componentService)

var radioEl = require('radio-button');
radioEl(componentService)

var selectEl = require('select-dropdown');
selectEl(componentService)

var valueEl = require('value');
valueEl(componentService)

var menuEl = require('menu');
menuEl(componentService)

var menuColumnEl = require('menu-column');
menuColumnEl(componentService)
