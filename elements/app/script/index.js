require('app/style/app.scss');

window.$ = window.jQuery = require('jquery/dist/jquery');
require('angular/angular');

var ComponentService = require('service/pseudo-webcomponent.directive');
var app = angular.module('signali',[])
var componentService = new ComponentService(app);

var coverElement = require('cover');
coverElement(componentService)

var googleAnalyticsElement = require('google-analytics');
googleAnalyticsElement(componentService)

var openSansFont = require('opensans-font');
openSansFont(componentService)

var calltoaction = require('calltoaction');
calltoaction(componentService)