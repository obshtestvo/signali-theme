import selectize from 'selectize/dist/js/selectize';

selectize.define('directajax', function (options) {
    var self = this,
        newMatchingIds = [],
        loadedMatchingIds = [];
    this.addItem = (function () {
        var original = self.addItem;
        return function (value, silent) {
            if (self.isSetup) {
                var item = this.options[value];
                if (item.href) {
                    self.close();
                    self.blur();
                    if (options.block) options.block()
                    window.location.href = item.href;
                    return;
                }
            }
            original.apply(self, arguments);
        };
    })();

    this.setup = (function () {
        var original = self.setup;
        return function () {
            var ret = original.apply(this, arguments);
            if (self.settings.load) {
                self.settings.load = (function () {
                    var originalLoadFn = self.settings.load;
                    return function (query, callback) {
                        originalLoadFn.call(self, query, function(results) {
                            newMatchingIds = results.map((item) => {
                                return item.id;
                            });
                            callback(results);
                        });
                    };
                })()
            }
            return ret;
        };
    })();

    this.onKeyUp = (function () {
        var original = self.onKeyUp;
        return function () {
            console.log('come on')
            var obsoleteMatchingIds = [];
            loadedMatchingIds.map((id) => {
                if (newMatchingIds.indexOf(id) === -1) {
                    obsoleteMatchingIds.push(id)
                }
            });
            obsoleteMatchingIds.map((id) => {
                self.removeOption(id);
            });
            loadedMatchingIds = newMatchingIds;
            newMatchingIds = [];
            original.apply(self, arguments);
        };
    })();

});


//selectize.define('no_results', function( options ) {
//    var KEY_LEFT      = 37;
//    var KEY_UP        = 38;
//    var KEY_RIGHT     = 39;
//    var KEY_DOWN      = 40;
//    var ignoreKeys = [KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN]
//    var self = this;
//
//    options = $.extend({
//        message: 'No results found.',
//        html: function(data) {
//            return '<div class="dropdown-empty-message">' + data.message + '</div>';
//        }
//    }, options );
//
//
//    self.on('type', function(str) {
//        if (!self.hasOptions) {
//            self.$empty_results_container.show();
//        } else {
//            self.$empty_results_container.hide();
//        }
//    });
//
//    self.onKeyUp = (function() {
//        var original = self.onKeyUp;
//
//        return function ( e ) {
//            if (ignoreKeys.indexOf(e.keyCode) > -1) return;
//            self.isOpen = false;
//            original.apply( self, arguments );
//        }
//    })();
//
//    self.onBlur = (function () {
//        var original = self.onBlur;
//
//        return function () {
//            original.apply( self, arguments );
//            self.$empty_results_container.hide();
//        };
//    })();
//
//    self.setup = (function() {
//        var original = self.setup;
//        return function() {
//            original.apply( self, arguments);
//            self.$empty_results_container = $(
//                options.html($.extend({
//                    classNames: self.$input.attr( 'class' )
//                }, options))
//            );
//            self.$empty_results_container.hide();
//            self.$dropdown.append(self.$empty_results_container);
//        };
//    })();
//});