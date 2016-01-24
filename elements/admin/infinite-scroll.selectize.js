import $ from 'jquery';
import selectize from 'selectize/dist/js/selectize';
import debounce from 'lodash.debounce';


var createLoadingMore = function () {
    var $option = $(
        '<div ' +
        'class="select2-results__option select2-results__option--load-more"' +
        'role="treeitem" aria-disabled="true"></div>'
    );

    $option.html("Зареждат се още...");
    return $option;
};

var shouldShowLoadingMore = function (data) {
    return data.pagination && data.pagination.more;
};

selectize.define('infinite_scroll', function (options) {
    var self = this;
    self.lastParams = {};
    self.lastData = {};
    self.$loadingMore = createLoadingMore();
    self.isLoading = false;

    var loadMore = function () {
        self.isLoading = true;
        var params = $.extend({}, {page: 1}, self.lastParams);
        params.page++;
        self.onSearchChange(undefined, params);
        self.lastParams = params
    };

    this.setup = (function () {
        var original = self.setup;
        return function () {
            var ret = original.apply(this, arguments);

            self.on('type', function (value) {
                self.lastParams.term = value;
                self.isLoading = true;
            });

            self.on('load:response', function (data) {
                self.$loadingMore.remove();
                self.isLoading = false;
                self.lastData = data;
            });

            self.$dropdown_content.on('scroll', function () {
                var isLoadMoreVisible = $.contains(
                    document.documentElement,
                    self.$loadingMore[0]
                );

                if (self.isLoading || !isLoadMoreVisible) {
                    return;
                }

                var currentOffset = self.$dropdown_content.offset().top +
                    self.$dropdown_content.outerHeight(false);
                var loadingMoreOffset = self.$loadingMore.offset().top +
                    self.$loadingMore.outerHeight(false);

                if (currentOffset + 50 >= loadingMoreOffset) {
                    loadMore();
                }
            });

            return ret;
        };
    })();


    this.refreshOptions = (function () {
        var original = self.refreshOptions;
        return function (triggerDropdown) {
            var ret = original.apply(this, arguments);
            if (shouldShowLoadingMore(self.lastData)) {
                self.$dropdown_content.append(self.$loadingMore);
            }
            return ret;
        };
    })();


    this.onSearchChange = (function () {
        return debounce(function (value, params) {
            var fn = self.settings.load;
            if (!fn) return;
            if (value) {
                params = {term: value}
            } else {
                if (!params) params = {};
                value = $.param(params)
            }
            if (self.loadedSearches.hasOwnProperty(value)) return;
            self.loadedSearches[value] = true;
            self.load(function(callback) {
                fn.apply(self, [params, callback]);
            });
        }, 300);
    })();
});


