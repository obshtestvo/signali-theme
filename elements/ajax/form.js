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
    /*
     * Don't show ajax result in no circumstances
     */
    preventShow: false,

    errorClass: 'error',
    successClass: 'success',
    dataType: 'json'
};


AjaxForm.prototype = {
    $form: null,
    options: null,

    block: function () {
        this.$container.block({
            message: null,
            overlayCSS: {
                backgroundColor: 'rgba(245, 245, 245, 0.6)',
                opacity: 1
            }
        });
        var $veil = this.$container.find('.blockOverlay');
        makeSpinner().spin($veil.get(0))
    },

    unblock: function () {
        this.$container.unblock();
    },

    _switchContent: function ($hide, $show, speed, final) {
        var self = this;

        toggleFixedHeight(self.$container, true);
        self.$container.animateContentSwitch($hide, $show, {
            speed: speed,
            width: false,
            final: function () {
                toggleFixedHeight(self.$container, false);
                if ($.isFunction(final)) {
                    final()
                }
            }
        });
    },

    _getResultContainer: function () {
        if (this._resultContainer) return this._resultContainer;
        var getter = this.options.resultContainer;
        var container;
        if ($.isFunction(getter)) container = getter(this.$form);
        if (typeof getter == 'string') container = this.$container.find(getter);
        if (getter instanceof $ && getter.length) container = getter;
        if (!container) {
            container = document.createElement('div');
            this.$container.append(container)
        }
        this._resultContainer = container;
        return container;
    },

    getSubmitHandler: function () {
        var self = this;
        var $form = self.$form;

        var handleError = function(error) {
            if ($.isFunction(self.options.error)) {
                var callbackReturn = self.options.error(error);
                if (callbackReturn) error = callbackReturn;
            }
            self.applyError(error)
        };

        var handler = function () {
            self.block();

            console.log('handler')
            var event = $.Event("ajax-submit");
            self.$form.trigger(event);
            if (event.isDefaultPrevented()) return;

            var requestOptions = {
                type: $form.find('input[name="X-Method"]').val() || $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: self.options.dataType,

                success: function (data) {
                    if (self.options.determineSuccess(data)) {
                        if ($.isFunction(self.options.success)) data = self.options.success(data);
                        self.applySuccess(data);
                    } else {
                        handleError(data)
                    }
                },

                error: function (xhr, status, err) {
                    var error = err;
                    if (self.options.dataType =='json' && xhr.responseJSON) {
                        error = xhr.responseJSON;
                    }
                    if (xhr.responseText) {
                        error = xhr.responseText;
                    }
                    handleError(error)
                },

                complete: function () {
                    self.showResult();
                }
            };
            if (self.options.pjax) requestOptions.headers = {"x-pjax": 1};
            $.ajax(requestOptions);
        };
        return handler;
    },

    applyResult: function (isSuccess, content, klass) {
        if (this.options.applyResult === false) {
            this.options.preventShow = true;
            return
        }
        if ($.isFunction(this.options.applyResult)) {
            var result = this.options.applyResult(this, isSuccess, content);
            if (result === false) {
                this.options.preventShow = true;
                return
            }
            if (!(result instanceof $)) return;
            if (result.length) {
                this._resultContainer = result;
                return
            }
        }
        this._getResultContainer().html(content);
        this.$container.addClass(klass)
    },

    applySuccess: function (content) {
        this.applyResult(true, content, this.options.successClass)
    },

    applyError: function (error) {
        this.applyResult(false, error, this.options.errorClass)
    },

    showResult: function () {
        if (this.options.applyResult === false) return;
        this.unblock();
        this._switchContent(
            this.$form,
            this._getResultContainer(),
            this.options.resultShowSpeed
        )
    }
};

module.exports = AjaxForm;
