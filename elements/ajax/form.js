var $ = require('jquery');
var makeSpinner = require('loader/spinner');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
var deepmerge = require('deepmerge');
require('block-ui');
require('service/jquery.animateContentSwitch.js');

var AjaxForm = function ($el, options) {
    options = options || {};
    this.options = deepmerge(AjaxForm.defaultOptions, options);
    if (!options.hasOwnProperty('dataType') && this.options.pjax) {
        this.options.dataType = 'html'
    }

    if ($el.is('form')) {
        this.$form = $el;
        if (this.options.containerAscendantSelector) {
            this.$container = $el.parent()
        } else {
            this.$container = $el.closest(this.options.containerAscendantSelector)
        }
    } else {
        this.$form = $el.find(this.options.formSubSelector || 'form').eq(0);
        this.$container = $el;
    }
    var self = this;
    //@todo define `resume` event and unblock when it happens, not at cancel
    this.$form.on('cancel', function() {
        self.unblock()
    })
};

/*
 * Default settings
 */
AjaxForm.defaultOptions = {
    /*
     * If $el is not a form, AjaxForm will search the descendants with this selector
     */
    formSubSelector: null,
    /*
     * If $el is a form, AjaxForm will search the ascendants with this selector
     */
    containerAscendantSelector: null,
    /*
     * Boolean or callback.
     * If callback, it's used apply the ajax response to the container.
     * If false (or callback that returns false), nothing will be applied to the container.
     */
    applyResult: null,
    /*
     * Selector, jQuery object or a function that returns jQuery object.
     * Indicates where the response will be placed if `showResult` option is true.
     * Can be overridden by the return value of `applyResult`
     */
    resultContainer: null,
    /*
     * Callback on success. If there's a return value it's treated as cleaned success response.
     */
    success: null,
    /*
     * Callback on error.  If there's a return value it's treated as cleaned error response.
     */
    error: null,
    /*
     * Callback that determines whether a successful HTTP response code actually denotes success
     */
    determineSuccess: function () {
        return true
    },
    /*
     * The speed used for animating transition between the form and the submission result
     */
    resultShowSpeed: 400,
    /*
     * Whether to notify server backend that client expects partial (pjax) response
     */
    pjax: false,

    errorClass: 'error',
    successClass: 'success',
    dataType: 'json'
};


AjaxForm.prototype = {
    $form: null,
    options: null,


    /*
     * Submit form
     */
    submit: function () {
        var self = this;
        var $form = self.$form;

        var event = $.Event("ajax-submit");
        self.$form.trigger(event);
        if (event.isDefaultPrevented()) return;

        self.block();

        var requestOptions = {
            type: $form.find('input[name="X-Method"]').val() || $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            dataType: self.options.dataType,

            success: function (data) {
                if (self.options.determineSuccess(data)) {
                    self.applyResult(true, data)
                } else {
                    self.applyResult(false, data)
                }
            },

            error: function (xhr, status, err) {
                var error = err;
                if (xhr.responseText) error = xhr.responseText;
                if (self.options.dataType =='json' && xhr.responseJSON) {
                    error = xhr.responseJSON;
                }
                self.applyResult(false, error)
            }
        };
        if (self.options.pjax) requestOptions.headers = {"x-pjax": 1};
        $.ajax(requestOptions);
    },

    /*
     * Act on server response
     */
    applyResult: function(isSuccess, response) {
        var showResult = true,
            callback = isSuccess ? this.options.success : this.options.error,
            klass = isSuccess ? this.options.successClass : this.options.errorClass;

        if ($.isFunction(callback)) {
            var callbackReturn = callback(response);
            showResult = callbackReturn !== false;
            if (callbackReturn) response = callbackReturn;
        }

        if (this.options.applyResult === false) showResult = false;

        if ($.isFunction(this.options.applyResult)) {
            var result = this.options.applyResult(this, isSuccess, response);
            if (result === false) showResult = false;
            if (result instanceof $ && result.length) {
                this._resultContainer = result;
            }
        } else {
            this._getResultContainer().html(response);
            this.$container.addClass(klass)
        }
        if (showResult) this.showResult();
    },


    /*
     * Get or create element to hold server response
     */
    _getResultContainer: function () {
        if (this._resultContainer) return this._resultContainer;
        var getter = this.options.resultContainer,
            $resultContainer;

        if ($.isFunction(getter)) $resultContainer = getter(this.$form);
        if (typeof getter == 'string') $resultContainer = this.$container.find(getter);
        if (getter instanceof $ && getter.length) $resultContainer = getter;
        if (!$resultContainer) {
            $resultContainer = $('<div>');
            this.$container.append($resultContainer)
        }

        this._resultContainer = $resultContainer;
        return $resultContainer;
    },

    /*
     * Show server response applied by applyResult
     */
    showResult: function () {
        this.unblock();
        toggleFixedHeight(this.$container, true);
        this.$container.animateContentSwitch(this.$form, this._getResultContainer(), {
            speed: this.options.resultShowSpeed,
            width: false,
            final: function () {
                toggleFixedHeight(self.$container, false);
            }
        });
    },

    /*
     * Block interaction on the container
     */
    block: function () {
        this.$container.block();
        var $veil = this.$container.find('.blockOverlay');
        makeSpinner().spin($veil.get(0))
    },


    /*
     * Resume interaction on the container
     */
    unblock: function () {
        this.$container.unblock();
    }
};

module.exports = AjaxForm;
