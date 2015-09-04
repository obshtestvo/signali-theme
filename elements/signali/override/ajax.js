var AjaxForm = require('ajax/form');
var jsonHandler = require('./ajaxJsonResult.js');
var preloader = require('loader/preloader');

module.exports = function (componentService) {
    AjaxForm.defaultOptions.applyResult = function(instance, isSuccess, content) {
        if (instance.options.pjax) {
            var $result = $(content);
            componentService.upgrade($result[0]);
            $result.each(function() {
                componentService.upgrade(this);
            });
            if (instance.$container.is('[modal-animation-container]')) {
                $result = $(instance.$container.closest('modal')[0].appendSecondary($result));
            } else {
                instance.$container.append($result);
            }
            $result.hide();
            return $result;
        } else if (instance.options.dataType == 'json') {
            return jsonHandler(instance, isSuccess, content);
        }
    };
    AjaxForm.defaultOptions.decorateBlocked = function(container) {
        preloader.generate(container)
    };
}