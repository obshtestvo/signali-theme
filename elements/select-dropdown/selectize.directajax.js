var selectize = require('selectize/dist/js/standalone/selectize.js');

selectize.define('directajax', function (options) {
    var self = this;
    this.addItem = (function () {
        var original = self.addItem;
        return function (value, silent) {
            var item = this.options[value];
            if (item.direct) {
                self.close();
                self.blur();
                if (options.block) options.block()
                window.location.href = item.id;
                return;
            }
            original.apply(self, arguments);
        };
    })();
});