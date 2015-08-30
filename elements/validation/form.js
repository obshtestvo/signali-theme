var $ = require('jquery');
var Parsley = require('parsleyjs');
var deepmerge = require('deepmerge');

var originalParleySuccessHandler = window.ParsleyUI._successClass;
window.ParsleyUI._successClass = function (fieldInstance) {
    if (fieldInstance.$element[0].hasAttribute('hide-success')) {
        fieldInstance._ui.validationInformationVisible = true;
        fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.errorClass);
    } else {
        originalParleySuccessHandler.apply(window.ParsleyUI, arguments)
    }
};

function ValidationForm($form, options) {
    options = deepmerge({
        errorClass: 'error',
        successClass: 'success',
        errorsContainer: function (field) {
            var $errorContainer = field.$element.find('[error]');
            if ($errorContainer.length) return $errorContainer;
        }
    }, options || {});

    var formValidation = $form.parsley(options);

    this.fields = [];
    for (var i = 0; i < formValidation.fields.length; i++) {
        this.fields.push(formValidation.fields[i]);
        this._upgradeFieldForCustomElements(formValidation.fields[i])
    }

    formValidation.on('field:error', function(field) {
        var $errorContainer = field.$element.find('[error]');
        $errorContainer.show()
    });
    formValidation.on('field:success', function(field) {
        var $errorContainer = field.$element.find('[error]');
        $errorContainer.hide()
    });
    this.validation = formValidation;
}


/*
 * Pass on event to validation adapter
 */
ValidationForm.prototype.on = function (eventName, handler) {
    this.validation.on(eventName, handler)
};


/*
 * Checks for custom elements that have implemented a `value` and `validate-trigger` properties
 */
ValidationForm.prototype._upgradeFieldForCustomElements = function (field) {
    var el = field.$element[0];
    if (el.hasOwnProperty('value')) {
        field.options.value = function (self) {
            return self.$element[0].value
        }
    }
    if (el.hasOwnProperty('validate-trigger') && !el.hasAttribute('validate-trigger')) {
        field.options.trigger = el['validate-trigger'];
    }
};


/*
 * Disable validation for all fields that have a group(s) that doesn't match the provided ones
 */
ValidationForm.prototype.disableGroupsExcept = function (group) {
    for (var i = 0; i < this.fields.length; i++) {
        var field = this.fields[i];
        if (!field.options.group) continue;
        if (field.options.excluded) delete field.options.excluded;
        if ($.isArray(field.options.group)) {
            if (field.options.group.indexOf(group)<0) {
                field.options.excluded = true;
            }
            continue;
        }
        if (field.options.group!=group) {
            field.options.excluded = true;
        }
    }
    this.validation.whenValid()
};


module.exports = ValidationForm;