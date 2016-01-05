import $ from 'jquery';
import Parsley from 'parsleyjs';
import deepmerge from 'deepmerge';
//@todo THIS SHOULD NOT BE INCLUDED.
import skate from 'skatejs/src';

var originalParleySuccessHandler = window.ParsleyUI._successClass;
window.ParsleyUI._successClass = function (fieldInstance) {
    if (fieldInstance.$element[0].hasAttribute('hide-success')) {
        fieldInstance._ui.validationInformationVisible = true;
        fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.errorClass);
    } else {
        originalParleySuccessHandler.apply(window.ParsleyUI, arguments)
    }
};

export default class ValidationForm {
    constructor ($form, options) {
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
        formValidation.fields.map(field => {
            this.fields.push(field);
            this._upgradeFieldForCustomElements(field)
        })

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
    on (eventName, handler) {
        this.validation.on(eventName, handler)
    };

    /*
     * Checks for custom elements that have implemented a `value` and `validate-trigger` properties
     */
    _upgradeFieldForCustomElements (field) {
        var self = this;
        var el = field.$element[0];
        skate.init(el);
        if (el.hasOwnProperty('value')) {
            field.options.value = function (self) {
                return self.$element[0].value
            }
        }
        field.addConstraint('server');
        field.$element.on('change keyup', function() {
            self.clearServerErrors()
        });
        if (el.hasOwnProperty('validate-trigger') && !el.hasAttribute('validate-trigger')) {
            field.options.trigger = el['validate-trigger'];
        }
    }

    /*
     * Disable validation for all fields that have a group(s) that doesn't match the provided ones
     */
    disableGroupsExcept (group) {
        var markAsExcluded = function(field) {
            field.options.excluded = true;
            var $errorContainer = field.$element.find('[error]');
            $errorContainer.hide()
        };

        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (!field.options.group) continue;
            if (field.options.excluded) delete field.options.excluded;
            if ($.isArray(field.options.group)) {
                if (field.options.group.indexOf(group)<0) {
                    markAsExcluded(field);
                }
                continue;
            }
            if (field.options.group!=group) {
                markAsExcluded(field);
            }
        }
        this.validation.whenValid()
    }

    /*
     * Reset server errors
     */
    clearServerErrors () {
        var field;
        for (var i = 0; i < this.validation.fields.length; i++) {
            field = this.validation.fields[i];
            if (field.serverError) {
                field.serverError = false;
                field.validate()
            }
        }
    }

    /*
     * Refresh error UI
     */
    refresh () {
        this.validation.validate()
    }
}