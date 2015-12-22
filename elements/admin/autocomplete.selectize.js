var $ = require('jquery');
var request = require('ajax/request');
var selectize = require('selectize/dist/css/selectize.bootstrap2.css');
require('./infinite-scroll.selectize.js');
require('./auto-width.selectize.js');

var init = function ($element, options) {
    $element.selectize(options);
};

var initHeavy = function ($element, settings) {
    var url = $element.data('ajax--url');
    var fieldId = $element.data('field_id');
    $element.selectize($.extend({
        valueField: 'id',
        labelField: 'text',
        plugins: {
            infinite_scroll: {},
            autowidth: {},
        },
        preload: true,
        load: function(params, callback) {
            request.json(url, function(data) {
                if (!data) {
                    callback([]);
                    return;
                }
                $element[0].selectize.trigger('load:response', {
                    results: data.results,
                    pagination: {
                        more: data.more
                    }
                });
                callback(data.results);
            }, $.extend({field_id: fieldId}, params));
        }
    }, settings));
};

$.fn.djangoSelect2 = function (options) {
    var settings = $.extend({}, options);
    $.each(this, function (i, element) {
        var $element = $(element);
        if ($element.hasClass('django-select2-heavy')) {
            initHeavy($element, settings);
        } else {
            init($element, settings);
        }
    });
    return this;
};