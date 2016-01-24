import $ from 'jquery';
import request from 'ajax/request';
import 'selectize/dist/css/selectize.bootstrap2.css';
import './infinite-scroll.selectize.js';
import './auto-width.selectize.js';

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
            autowidth: {}
        },
        preload: true,
        load (params, callback) {
            request.json({
                url: url,
                data: $.extend({field_id: fieldId}, params),
                callback (data) {
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
                }
            });
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