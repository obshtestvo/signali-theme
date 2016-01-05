var getAjaxErors = function($form, response) {
    const $prefix = $form.find('input[name="prefix"]')
    var errors, errorKey = 'form';
    if ($prefix.length) {
        errorKey = $prefix.val() + errorKey
    }
    if (response.errors.hasOwnProperty(errorKey)) {
        errors = response.errors[errorKey];
        if (response.errors.hasOwnProperty('generic')) errors.generic = response.generic;
    } else {
        errors = response.errors;
    }
    return errors
};


export default function(instance, isSuccess, content) {
    var $notifications = instance.$container.find('notification[for="form"]');
    if (!isSuccess) {
        var $container = $notifications.filter('[error]');
        var $item;
        var message;
        var validationField;
        var $form = instance.$form;
        var errors = getAjaxErors($form, content);
        for (var fieldName in errors) {
            if (!errors.hasOwnProperty(fieldName)) continue;
            var $el = $form.find('[validate-id][name="'+fieldName+'"], [validate-id][validate-name="'+fieldName+'"]');
            message = $.isArray(errors[fieldName]) ? errors[fieldName].join(', ') : errors[fieldName];
            if ($el.length) {
                validationField = $el.parsley();
                validationField.serverError = true;
                validationField.options.serverMessage = message;
                validationField.validate();
                continue;
            }
            $item = $('<p>');
            $item.append($('<strong>').append(fieldName+': '));
            $item.append(message);
            $container.append($item);
        }
        instance.unblock()
        return false;
    }
    return $notifications.filter('[success]');
};