import selectize from 'selectize/dist/js/selectize';

selectize.define('filtering', function (options) {
    var self = this;
    this.setup = (function () {
        var original = self.setup;
        return function () {
            var ret = original.apply(this, arguments);
            var isFilters = false;
            self.$dropdown_filters = options.filters;
            self.$dropdown_filters.on('mousedown', function () {
                isFilters = true;
            });
            self.$dropdown_filters.on('mouseup', function () {
                isFilters = false;
            });
            self.$dropdown_filters.find('input,a').on('blur', function () {
                setTimeout(function () {
                    if (isFilters) return;
                    self.onBlur(null, document.activeElement)
                }, 1)
            });
            self.$dropdown.append(self.$dropdown_filters);
            return ret;
        };
    })();

    this.onBlur = (function () {
        var original = self.onBlur;
        return function (e, dest) {
            var onBlurArgs = arguments;
            setTimeout(function () {
                if (!dest) return;
                if ($.contains(self.$dropdown_filters[0], dest)) return;
                original.apply(self, onBlurArgs);
            }, 1);
        };
    })();
});