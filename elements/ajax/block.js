import 'block-ui';
import './block.scss';
import $ from 'jquery';
import deepmerge from 'deepmerge';

/*
 * Reset default css so that it can be styled with css
 */
$.blockUI.defaults.message = null;
$.blockUI.defaults.css = {};
$.blockUI.defaults.overlayCSS =  {};


export default class Blocker {

    static defaultOptions = {
        /*
         * Function that decorate the blocked interaction container
         */
        decorate: null
    };

    constructor (el, options) {
        this.options = deepmerge(Blocker.defaultOptions, options || {});
        this.setElement(el);
        this._isBlocked = false;
    }

    block () {
        if (this._isBlocked) return;
        this.$el.block(this.options);
        var $veil = this.$el.find('.blockOverlay');
        if ($.isFunction(this.options.decorate)) this.options.decorate($veil[0]);
        this._isBlocked = true;
    }

    unblock () {
        if (!this._isBlocked) return;
        this.$el.unblock();
        this.$el.find('.blockUI').parent().unblock(); // custom elements might have appended it elsewhere
        this._isBlocked = false;
    }

    setElement (el) {
        if (!(el instanceof $)) { el = $(el) }
        this.$el = el;
    }
}