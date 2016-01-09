import selectize from 'selectize/dist/js/selectize';

var $document = $(document);
selectize.define('touch', function (options) {
    var self = this;
    this.setup = (function () {
        var original = self.setup;
        return function () {
            var ret = original.apply(this, arguments);
            var isTouchMoving = false;

            $document.on('touchmove' + this.eventNS, function(e) {
                isTouchMoving = true;
            });

            $document.on('touchend' + this.eventNS, function(e) {
                if (self.isFocused && !isTouchMoving) {
                    // prevent events on the dropdown scrollbar from causing the control to blur
                    if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
                        return false;
                    }
                    // blur on click outside
                    if (
                        !self.$dropdown.has(e.target).length && e.target !== self.$dropdown[0] &&
                        !self.$control.has(e.target).length && e.target !== self.$control[0]
                    ) {
                        self.blur(e.target);
                    }
                }
                isTouchMoving = false;
            });
            return ret;
        };
    })();
});