var selectize = require('selectize/dist/js/standalone/selectize.js');
var $ = require('jquery');
var AddressPicker = require('./addressPicker');
require('./select-dropdown.scss');

module.exports = function (componentService) {
    componentService.register('select-dropdown', {
        template: require('./select-dropdown.html'),
        include: {
            locationArrow: require('icons/location-arrow.svg')
        },
        created: function () {
            var el = this;
            var $el = $(el);
            var $input =  $el.find('> select');
            var $filters =  $el.find('.filters');
            if (el.hasAttribute('location')) {
                var picker = new AddressPicker($input, $('<h1>').get(0));
            } else {
                var values = this.$detachedContent.filter('value');
                var selected = values.filter('[selected]').map(function() {
                    return this.id
                }).get();
                var choices = values.map(function() {
                    var $this = $(this);
                    return {id: this.id, title: $this.text()}
                }).get();

                var options = {
                    valueField: 'id',
                    labelField: 'title',
                    searchField: 'title',
                    options: choices,
                    items: selected,
                    plugins: {}
                };
                if (el.hasAttribute('multiple')) {
                    options.plugins['remove_button']= {
                        label: require('icons/times-circle.svg')
                    };
                }
                if (el.hasAttribute('freetext')) {
                    options.create = true
                }
                if ($filters.length) {
                    options.plugins['filtering']= {
                        filters: $filters
                    };
                }
                $input.selectize(options);
            }
        }
    })
};


selectize.define('filtering', function(options) {
    var self = this;
    this.setup = (function() {
        var original = self.setup;
        return function() {
            var ret = original.apply(this, arguments);
            var isFilters = false;
            self.$dropdown_filters = options.filters;
            self.$dropdown_filters.on('mousedown', function() {
                isFilters = true;
            });
            self.$dropdown_filters.on('mouseup', function() {
                isFilters = false;
            });
            self.$dropdown_filters.find('input,a').on('blur', function() {
                setTimeout(function() {
                    if (isFilters) return;
                    self.onBlur(null, document.activeElement)
                }, 1)
            });
            self.$dropdown.append(self.$dropdown_filters)
            return ret;
        };
    })();

    this.onBlur = (function() {
        var original = self.onBlur;
        return function(e, dest) {
            var onBlurArgs = arguments;
            setTimeout(function(){
                if (!dest) return;
                if ($.contains(self.$dropdown_filters[0], dest)) return;
                original.apply(self, onBlurArgs);
            }, 1);
        };
    })();
});