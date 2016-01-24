import 'selectize/dist/js/selectize';
import $ from 'jquery';
import googlemap from 'service/google.maps';
import './selectize.navarrow';

/**
 * Places autocomplete
 * @param $el
 * @param selectizeOptions
 * @constructor
 */
export class Simple {
    $el = null;
    pickerAPI = null;
    
    constructor ($el, selectizeOptions) {
        selectizeOptions.plugins.navarrow = {};
        this.$el = $el;
        this.pickerAPI = $el.selectize(selectizeOptions)[0].selectize
    }
    
    close () {
        this.pickerAPI.close()
    }
    
    blur () {
        this.pickerAPI.blur()
    }
}

/**
 * Places autocomplete
 * @param $el
 * @param creditsEl
 * @param queryTransformation
 * @constructor
 */
export class Google {
    $el = null;
    pickerAPI = null;
    map = null;
    autocomplete = null;

    constructor($el, creditsEl, queryTransformation) {
        var _self = this;
        _self._initUI($el);
        googlemap.load(function(gMap) {
            _self._initGeo(gMap, $el, creditsEl, queryTransformation)
        })
    }

    _initGeo (gMap, $el, creditsEl, queryTransformation) {
        var _self = this;
        _self.events = {};
        _self.$el = $el;
        _self.autocompleteService = new gMap.places.AutocompleteService();
        _self.geocoder = new gMap.Geocoder();
        _self.placesService = new gMap.places.PlacesService(creditsEl);
    }

    _initUI ($el) {
        var _self = this;
        var googleOptions = {
            types: ['geocode'],
            componentRestrictions: {country: 'BG'}
        };
        var lastResults = {};
        $el.selectize({
            create: false,
            options: [],
            plugins: ['restore_on_backspace', 'navarrow'],
            score (search) {
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
            load (query, callback) {
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
                        var results = [];
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

        _self.pickerAPI.on('change', function(val=[]) {
            if (!val.length) return;
            var text = _self.pickerAPI.getItem(val).text();
            var loc = null;
            var finish = function(place) {
                if (typeof place != 'object') return;

                if (place.geometry.viewport) {
                    loc = place.geometry.viewport.getCenter();
                } else {
                    loc = place.geometry.location;
                }
                $el.trigger('found', [text, loc, place.address_components])
            };
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
    }

    focus () {
        this.pickerAPI.open()
    }

    update (id, text) {
        var pickerAPI = this.pickerAPI;
        pickerAPI.addOption({'value': id , 'text': text });
        pickerAPI.setValue(id)
    }

    destroy () {
        var _self = this;
        _self.autocomplete.unbind('bounds');
        _self.gMap = null;
    }
}