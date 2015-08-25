var Parsley = require('parsleyjs');
var deepmerge = require('deepmerge');


function ValidationForm($form, options) {

    var formValidation = $form.parsley(deepmerge({
        classHandler: function (field, b) {
            //    ....
        },
        errorClass: 'error',
        successClass: 'success',
        errorsContainer: function (field) {
            var $errorContainer = field.$element.find('[error]');
            if ($errorContainer.length) return $errorContainer;
        }
    }, options || {}));

    for (var i = 0; i < formValidation.fields.length; i++) {
        this._upgradeFieldForCustomElements(formValidation.fields[i])
    }

    formValidation.on('field:error', function(field) {
        var $errorContainer = field.$element.find('[error]');
        $errorContainer.prop('hidden', false)
    });
    formValidation.on('field:success', function(field) {
        var $errorContainer = field.$element.find('[error]');
        $errorContainer.prop('hidden', true)
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


module.exports = ValidationForm