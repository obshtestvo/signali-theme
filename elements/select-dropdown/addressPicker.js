var selectize = require('selectize/dist/js/standalone/selectize.js');
var googlemap = require('service/google.maps');
var navarrow = require('icons/location-arrow.svg');

/**
 * Places autocomplete
 * @param $el
 * @param creditsEl
 * @param queryTransformation
 * @constructor
 */
var AddressSearch = function($el, creditsEl, queryTransformation) {
    var _self = this;
    _self._initUI($el)
    googlemap.load(function(gMap) {
        _self._initGeo(gMap, $el, creditsEl, queryTransformation)
    })
}

AddressSearch.prototype = {
    $el: null,
    pickerAPI: null,
    map: null,
    autocomplete: null,

    _initGeo: function(gMap, $el, creditsEl, queryTransformation) {
        var _self = this;
        _self.events = {};
        _self.$el = $el;
        _self.autocompleteService = new gMap.places.AutocompleteService();
        _self.geocoder = new gMap.Geocoder();
        _self.placesService = new gMap.places.PlacesService(creditsEl);
    },

    _initUI: function($el) {
        var _self = this;
        var googleOptions = {
            types: ['geocode'],
            componentRestrictions: {country: 'BG'}
        };
        var lastResults = {}
        $el.selectize({
            create: false,
            options: [],
            plugins: ['restore_on_backspace', 'navarrow'],
            score: function(search) {
                var textScore = this.getScoreFunction(search);
                return function(item) {
                    var score =  textScore(item);
                    if (score == 0) return score;
                    if (item.source && item.source.pos) {
                        score = score * 1+item.source.pos
                    }
                    return score;
                };
            },
            load: function (query, callback) {
                if (!query.length) return callback();
                if (_self.queryTransformation) query = _self.queryTransformation() + query;
                _self.autocompleteService.getPlacePredictions($.extend({}, googleOptions, {
                    'input': query
                }), function (list, status) {
                    if (list == null || list.length == 0) {
                        _self.geocoder.geocode({
                            address: query,
                            componentRestrictions: googleOptions.componentRestrictions
                        }, function (list, status) {
                            lastResults = {};
                            var results = [];
                            var length = list.length;
                            $.each(list, function (i, loc) {
                                var value = loc.geometry.location.toUrlValue();
                                var text = loc.formatted_address;
                                if (!_self.pickerAPI.getOption(value).length) {
                                    results.push({value: value, text: text, source: {term: query, pos: length-i}})
                                }
                                lastResults[loc.formatted_address] = loc
                            });
                            callback(results)
                        })
                    } else {
                        var results = []
                        $.each(list, function (i, loc) {
                            var value = loc.place_id;
                            var text = loc.description;
                            var length = list.length;
                            if (!_self.pickerAPI.getOption(value).length) {
                                results.push({value: value, text: text, source: {term: query, pos: length-i}})
                            }
                        });
                        callback(results)
                    }
                });
            }
        });
        _self.pickerAPI = $el[0].selectize;

        _self.pickerAPI.on('change', function(val) {
            if (!val.length) return;
            var text = _self.pickerAPI.getItem(val).text()
            var loc = null;
            var finish = function(place) {
                if (typeof place != 'object') return;

                if (place.geometry.viewport) {
                    loc = place.geometry.viewport.getCenter();
                } else {
                    loc = place.geometry.location;
                }
                $el.trigger('found', [text, loc, place.address_components])
            }
            if (val.indexOf(',')<0) {
                _self.placesService.getDetails({
                    placeId: val
                }, function(result, status) {
                    finish(result);
                })
            } else {
                finish(lastResults[text])
            }
        })
    },

    focus: function() {
        this.$el[0].selectize.open()
    },

    update: function(id, text) {
        var pickerAPI = this.pickerAPI;
        pickerAPI.addOption({"value": id , "text": text })
        pickerAPI.setValue(id)
    },

    destroy: function() {
        var _self = this;
        _self.autocomplete.unbind("bounds");
        _self.gMap = null;
    }
}

selectize.define('navarrow', function() {
    var self = this;
    this.setup = (function() {
        var original = self.setup;
        return function() {
            var ret = original.apply(this, arguments);
            self.$control.append(navarrow)
            return ret;
        };
    })();
});

module.exports =  AddressSearch;
