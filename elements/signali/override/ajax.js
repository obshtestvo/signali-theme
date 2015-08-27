var AjaxForm = require('ajax/form');

AjaxForm.defaultOptions.applyResult = function(instance, isSuccess, content) {
    if (instance.options.pjax) {
        var $result = $(content);
        $result.hide();
        instance.$container.append($result)
        return $result;
    }
};