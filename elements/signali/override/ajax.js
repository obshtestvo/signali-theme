var AjaxForm = require('ajax/form');

var getAjaxErors = function($form, response) {
    var errorKey = 'form';
    var $prefix = $form.find('input[name="prefix"]');
    if ($prefix.length) {
        errorKey = $prefix.val() + errorKey
    }
    errors = response.errors[errorKey];
    if (response.errors.hasOwnProperty('generic')) errors.generic = response.generic;
    return errors
};

AjaxForm.defaultOptions.applyResult = function(instance, isSuccess, content) {
    var $notifications = instance.$container.find('notification[for="form"]');
    console.log($notifications)
    if (!isSuccess) {
        var $container = $notifications.filter('[error]');
        var $item;
        var message;
        var errors = getAjaxErors(instance.$form, content);
        for (var fieldName in errors) {
            if (!errors.hasOwnProperty(fieldName)) continue;
            $item = $('<p>');
            $item.append($('<strong>').append(fieldName+': '));
            message = $.isArray(errors[fieldName]) ? errors[fieldName].join(', ') : errors[fieldName];
            $item.append(message);
            $container.append($item);
        }
        return $container;
    }
    return $notifications.filter('[success]')
};