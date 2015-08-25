var $ = require('jquery');
var makeSpinner = require('loader/spinner');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
var deepmerge = require('deepmerge');
require('service/jquery.animateContentSwitch.js');

var AjaxForm = function ($container, options) {
    var defaults = {
        controlsWrapperSelector: '.controls',
        resultWrapperSelector: '.msg',
        success: null,
        dataType: 'json',
        pjax: false,
        error: null,
        showResult: true,
        determineSuccess: function () {
            return true
        }
    };
    options = options || {};
    this.$container = $container;
    this.options = deepmerge(defaults, options || {});
};

AjaxForm.prototype = {
    $container: null,
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
        var self = this;
        setTimeout(function () {
            self.$container.unblock();
        }, 3000)
    },

    _switchContent: function ($hide, $show, speed, final) {
        var self = this;
        var $container = self.$container.find('.animation-container');

        toggleFixedHeight($container, true);
        $container.animateContentSwitch($hide, $show, {
            speed: speed,
            width: false,
            final: function () {
                toggleFixedHeight($container, false);
                if ($.isFunction(final)) {
                    final()
                }
            }
        });
    },

    getSubmitHandler: function () {
        var self = this;
        var $form = self.$container;

        var handler = function () {
            self.block();

            var requestOptions = {
                type: $form.find('input[name="X-Method"]').val() || $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: self.options.dataType,

                success: function (data) {
                    if (self.options.determineSuccess(data)) {
                        if ($.isFunction(self.options.success)) self.options.success(data);
                        if (self.options.showResult) self.applySuccess(data.Status)
                    } else {
                        if (self.options.showResult) self.applyError(data)
                    }
                },

                error: function (xhr, status, err) {
                    var error = xhr.responseJSON ? xhr.responseJSON.Status : err;
                    if ($.isFunction(self.options.error)) self.options.error(error);
                    if (self.options.showResult) self.applyError(error);
                },

                complete: function () {
                    if (self.options.showResult) {
                        self.showResult();
                    }
                }
            };
            if (self.options.pjax) requestOptions.headers = {"x-pjax": 1}
            $.ajax(requestOptions);
            return false;
        };
        return handler;
    },

    applyResult: function (msg, klass) {
        var $form = this.$container;
        $form.find(this.options.resultWrapperSelector).html(msg);
        $form.addClass(klass)
    },

    applySuccess: function (msg) {
        this.applyResult(msg, 'success')
    },

    applyError: function (error) {
        this.applyResult(error, 'error')
    },

    showResult: function () {
        var $form = this.$container;
        this.unblock();
        this._switchContent(
            $form.find(this.options.controlsWrapperSelector),
            $form.find(this.options.resultWrapperSelector),
            100
        )
    }
};

module.exports = AjaxForm;
