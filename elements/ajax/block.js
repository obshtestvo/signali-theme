var $ = require('jquery');
var deepmerge = require('deepmerge');
require('block-ui');
require('./block.scss');
/*
 * Reset default css so that it can be styled with css
 */
$.blockUI.defaults.message = null;
$.blockUI.defaults.css = {};
$.blockUI.defaults.overlayCSS =  {};


var Blocker = function(el, options) {
    this.options = deepmerge(Blocker.defaultOptions, options || {});
    this.setElement(el);
};

/*
 * Default settings
 */
Blocker.defaultOptions = {
    /*
     * Function that decorate the blocked interaction container
     */
    decorate: null
};

Blocker.prototype = {
    _isBlocked: false,

    block: function() {
        if (this._isBlocked) return;
        this.$el.block(this.options);
        var $veil = this.$el.find('.blockOverlay');
        if ($.isFunction(this.options.decorate)) this.options.decorate($veil[0]);
        this._isBlocked = true;
    },
    unblock: function() {
        if (!this._isBlocked) return;
        this.$el.unblock();
        this.$el.find('.blockUI').parent().unblock(); // custom elements might have appended it elsewhere
        this._isBlocked = false;
    },
    setElement: function(el) {
        if (!(el instanceof $)) { el = $(el) }
        this.$el = el;
    }
};

module.exports = Blocker;
