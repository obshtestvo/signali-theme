var $ = require('jquery');
var selectize = require('selectize/dist/js/standalone/selectize');

selectize.define('autowidth', function (options) {
    var self = this;
    this.positionDropdown = (function () {
        var original = self.positionDropdown;
        return function () {
            var ret = original.apply(this, arguments);
            var c = self.$wrapper.clone();
            c.css({
                position: 'absolute',
                visibility: 'hidden',
                opacity: 0,
                height:'100px',
                left:0,
                right:0
            }).appendTo('body');
            c.find('.selectize-dropdown-content').css({
                'overflow-x': 'inherit',
                'overflow-y': 'scroll',
            });
            self.$dropdown.width(c.find('.selectize-dropdown').css({
                width: 'auto',
                'white-space': 'nowrap'
            }).outerWidth());
            c.remove();
            return ret;
        };
    })();
});


