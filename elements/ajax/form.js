var $ = require('jquery');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
var deepmerge = require('deepmerge');
var request = require('./request');
var Blocker = require('./block');
require('service/jquery.animateContentSwitch.js');

var AjaxForm = function ($el, options) {
    this.options = deepmerge(AjaxForm.defaultOptions, options || {});

    if ($el.is('form')) {
        this.$form = $el;
        if (!this.options.interactionContainer) {
            this.$container = $el.parent()
        } else {
            this.$container = this.options.interactionContainer;
        }
    } else {
        this.$form = $el.find('form').eq(0);
        this.$container = $el;
    }
    if (!this.options.replaceableElement) {
        this.$replaceable = this.$form;
    } else {
        this.$replaceable = this.options.replaceableElement;
    }
    this.blocker = new Blocker(this.$container, this.blockerOptions)
};

/*
 * Default settings
 */
AjaxForm.defaultOptions = {
    /*
     * Element that will blocked and will have its contents swapped from `replaceableElement` to `resultElement`
     * If $el is a form, AjaxForm will search the ascendants with this selector
     */
    interactionContainer: null,
    /*
     * Element that will be replaced with ajax response. Defaults to the form element
     */
    replaceableElement: null,
    /*
     * Selector, jQuery object or a function that returns jQuery object.
     * Indicates where the response will be placed.
     * Can be overridden by the return value of `applyResult`
     */
    resultElement: null,
    /*
     * Boolean or callback.
     * If callback, it's used apply the ajax response to the container.
     * If false (or callback that returns false), nothing will be applied to the container.
     */
    applyResult: null,
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
     * Whether to notify server backend that client expects partial (pjax) response.
     * If true, this will ignore `dataType` and always request html
     */
    pjax: false,
    /*
     * Options to pass to Blocker
     */
    blockerOptions: {},

    errorClass: 'error',
    successClass: 'success',
    dataType: 'json'
};


AjaxForm.prototype = {
    $container: null,
    blocker: null,
    $form: null,
    $replaceable: null,
    options: null,


    /*
     * Submit form
     */
    submit: function () {
        var self = this;
        var $form = self.$form;

        var event = $.Event("ajax-submit");
        self.$form.trigger(event, [self]);
        if (event.isDefaultPrevented()) return;

        self.block();

        var requestArgs = [
            /* URL: */ $form.attr('action'),
            /* Method: */ $form.find('input[name="X-Method"]').val() || $form.attr('method'),
            /* Data: */ $form.serialize(),
            /* Options: */ {
                determineSuccess: self.options.determineSuccess,
                success: function(data) {
                    self.applyResult(true, data)
                },
                error: function(data) {
                    self.applyResult(false, data)
                }
            }
        ];
        if (self.options.pjax) {
            return request.pjax.apply(this, requestArgs)
        }
        return request[self.options.dataType].apply(this, requestArgs)
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
                this.$resultElement = result;
            }
        } else {
            this._getResultElement().html(response);
            this.$container.addClass(klass)
        }
        if (showResult) this.showResult(this._getResultElement());
    },


    /*
     * Get or create element that shows server response
     */
    _getResultElement: function () {
        if (this.$resultElement) return this.$resultElement;
        var getter = this.options.resultElement,
            $resultElement;

        if ($.isFunction(getter)) $resultElement = getter(this.$form);
        if (typeof getter == 'string') $resultElement = this.$container.find(getter);
        if (getter instanceof $ && getter.length) $resultElement = getter;
        if (!$resultElement) {
            $resultElement = $('<div>');
            this.$container.append($resultElement)
        }

        this.$resultElement = $resultElement;
        return $resultElement;
    },


    setReplaceableElement: function ($el) {
        this.$replaceable = $el;
    },


    setInteractionContainer: function ($el) {
        this.$container = $el;
        this.blocker.setElement($el)
    },

    /*
     * Show server response applied by applyResult
     */
    showResult: function ($result) {
        this.unblock();
        var $container = this.$container;
        toggleFixedHeight($container, true);
        $container.animateContentSwitch(this.$replaceable, $result, {
            speed: this.options.resultShowSpeed,
            width: false,
            final: function () {
                toggleFixedHeight($container, false);
            }
        });
    },

    /*
     * Block interaction on the container
     */
    block: function () {
        this.blocker.block()
    },


    /*
     * Resume interaction on the container
     */
    unblock: function () {
        this.blocker.unblock()
    }
};

module.exports = AjaxForm;
