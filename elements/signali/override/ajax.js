var AjaxForm = require('ajax/form');

module.exports = function (componentService) {
    AjaxForm.defaultOptions.applyResult = function(instance, isSuccess, content) {
        if (instance.options.pjax) {
            var $result = $(content);
            $result.hide();
            componentService.upgrade($result[0]);
            instance.$container.append($result);
            return $result;
        }
    };
}