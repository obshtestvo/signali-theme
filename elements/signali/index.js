require('./fonts.scss');
require('normalize.css/normalize.css');
require('reset.scss');

// jquery plugins are not all used to CommonJS
window.$ = window.jQuery = require('jquery');

require('skatejs-polyfill-mutation-observer/dist/skatejs-polyfill-mutation-observer.js');

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

var validationElement = require('validation');
validationElement(componentService);

var ajaxElement = require('ajax');
ajaxElement(componentService);
var ajaxOverride = require('./override/ajax');
ajaxOverride(componentService)

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

var cardEl = require('card');
cardEl(componentService);

var bubbleEL = require('bubble');
bubbleEL(componentService);

var paginationEl = require('pagination');
paginationEl(componentService);

var cardItemEl = require('card-item');
cardItemEl(componentService);

var ratingEl = require('rating');
ratingEl(componentService);

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

var textFieldEl = require('text-field');
textFieldEl(componentService);

var nameTagEl = require('name-tag');
nameTagEl(componentService);

var filteringEl = require('filtering');
filteringEl(componentService);

var storyEl = require('story');
storyEl(componentService);

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

var modalEl = require('modal');
modalEl(componentService);

var authElement = require('auth');
authElement(componentService);

var resumeElement = require('resume');
resumeElement(componentService);

var featuresElement = require('features');
featuresElement(componentService);

var featuresItemElement = require('features-item');
featuresItemElement(componentService);

var surveyQestionElement = require('survey-question');
surveyQestionElement(componentService);

var commentsElement = require('comments');
commentsElement(componentService);

var surveyElement = require('survey');
surveyElement(componentService);

var commentElement = require('comment');
commentElement(componentService);

var popularElement = require('popular');
popularElement(componentService);

var hiddenAttribute = require('hidden');
hiddenAttribute(componentService);

var proposalElement = require('proposal');
proposalElement(componentService);