require('app/fonts.scss');
require('normalize.css/normalize.css');
require('reset.scss');

// jquery plugins are not yet all used to CommonJS
window.$ = window.jQuery = require('jquery');
var ComponentService = require('service/pseudo-webcomponent.skate');
var componentService = new ComponentService();

var loaderElement = require('loader');
loaderElement(componentService);

var coverElement = require('cover');
coverElement(componentService);

var introElement = require('intro');
introElement(componentService);

var topNavElement = require('top-nav');
topNavElement(componentService);

var loginBoxElement = require('login-box');
loginBoxElement(componentService);

var logoElement = require('logo');
logoElement(componentService);

var callToActionElement = require('call-to-action');
callToActionElement(componentService);

var underlineElement = require('underline');
underlineElement(componentService);

var googleAnalyticsElement = require('google-analytics');
googleAnalyticsElement(componentService);

var actionButtonEl = require('action-button');
actionButtonEl(componentService);

var breadCrumbEl = require('breadcrumb');
breadCrumbEl(componentService);

var crumbEl = require('crumb');
crumbEl(componentService);

var tabsEl = require('tabs');
tabsEl(componentService);

var checkboxEl = require('checkbox');
checkboxEl(componentService);

var radioEl = require('radio-button');
radioEl(componentService);

var selectEl = require('select-dropdown');
selectEl(componentService);

var valueEl = require('value');
valueEl(componentService);

var menuEl = require('menu');
menuEl(componentService);

var menuColumnEl = require('menu-column');
menuColumnEl(componentService);

var headlineEl = require('headline');
headlineEl(componentService);

var cardsAreaEl = require('cards-area');
cardsAreaEl(componentService);

var cardsEl = require('cards');
cardsEl(componentService);

var cardEl = require('card');
cardEl(componentService);

var tagsEl = require('tags');
tagsEl(componentService);

var tagEl = require('tag');
tagEl(componentService);

var ratingEl = require('rating');
ratingEl(componentService);

var starEl = require('star');
starEl(componentService);

var donationEl = require('donation');
donationEl(componentService);

var footerWrapperEl = require('footer-wrapper');
footerWrapperEl(componentService);

var footerNavigationEl = require('footer-navigation');
footerNavigationEl(componentService);

var footerColumnEl = require('footer-column');
footerColumnEl(componentService);

var sponsorsEl = require('sponsors');
sponsorsEl(componentService);

var modalEl = require('modal');
modalEl(componentService);

var inputFieldEl = require('input-field');
inputFieldEl(componentService);

var notificationEl = require('notification');
notificationEl(componentService);

var socialButtonEl = require('social-button');
socialButtonEl(componentService);

var settingsEl = require('settings');
settingsEl(componentService);

var filtersEl = require('filters');
filtersEl(componentService);

var pageElement = require('page');
pageElement(componentService);

var authElement = require('auth');
authElement(componentService);

var resumeElement = require('resume');
resumeElement(componentService);

var listElement = require('list');
listElement(componentService);

var listItemElement = require('list-item');
listItemElement(componentService);

var commentsElement = require('comments');
commentsElement(componentService);

var commentElement = require('comment');
commentElement(componentService);

var popularElement = require('popular');
popularElement(componentService);