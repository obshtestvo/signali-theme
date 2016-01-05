import selectize from 'selectize/dist/js/standalone/selectize';
import navarrow from 'icons/location-arrow.svg';


selectize.define('navarrow', function() {
    var self = this;
    this.setup = (function() {
        var original = self.setup;
        return function() {
            var ret = original.apply(this, arguments);
            self.$control.append(navarrow);
            return ret;
        };
    })();
});