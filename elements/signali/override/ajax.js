var AjaxForm = require('ajax/form');
var jsonHandler = require('./ajaxJsonResult.js');

module.exports = function (componentService) {
    AjaxForm.defaultOptions.applyResult = function(instance, isSuccess, content) {
        if (instance.options.pjax) {
            var $result = $(content);
            $result.hide();
            componentService.upgrade($result[0]);
            $result.each(function() {
                componentService.upgrade(this);
            });
            instance.$container.append($result);
            return $result;
        } else if (instance.options.dataType == 'json') {
            return jsonHandler(instance, isSuccess, content);
        }
    };
}