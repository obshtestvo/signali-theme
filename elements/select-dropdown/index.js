import $ from 'jquery';
import {Simple as SimpleAdressPicker} from './addressPicker';
import request from 'ajax/request';
import Blocker from 'ajax/block';
import template from './select-dropdown.html';
import extractData from './data-extract';
import 'selectize/dist/js/selectize';
import './selectize.filtering';
import './selectize.directajax';
import './selectize.touch';
import './select-dropdown.scss';
import removeButtonLabel from 'icons/times-circle.svg';

export class SelectDropdownElement {
    static displayName = 'select-dropdown';
    static template = template;

    static ready (el) {
        var $el = $(el),
            $input = $el.find('> select'),
            $filters = $el.find('.filters'),
            isMultiple = el.hasAttribute('multiple'),
            blocking;

        var data = extractData($(el.detachedContent).filter('value'));
        el.data = data;

        var options = {
            valueField: 'id',
            labelField: 'title',
            selectOnTab: !isMultiple,
            closeAfterSelect: isMultiple,
            score (search) {
                var textScore = this.getScoreFunction(search);
                return function(item) {
                    var score =  textScore(item);
                    if (item.score) {
                        score = score * (1+item.score);
                        if (score == 0) score = 0.1 * item.score;
                    }
                    return score;
                };
            },
            searchField: 'title',
            optgroupField: 'group',
            options: data.choices,
            items: data.selected,
            render: {
                option (item, escape) {
                    return '<div class="'+(item.class ? item.class : '')+'">' +
                        (item.prefix ? '<span class="prefix">' + escape(item.prefix) + '</span>': '') +
                        '<span class="caption">' + escape(item.title) + '</span>' +
                        (item.suffix ? '<span class="suffix">' + escape(item.suffix) + '</span>': '') +
                        '</div>';
                }
            },
            plugins: {
                //no_results: {}
                touch: {}
            }
        };

        if (isMultiple) {
            options.plugins.remove_button =  {
                label: removeButtonLabel
            };
        } else {
            options.maxItems = 1
        }
        if (el.hasAttribute('freetext')) {
            options.create = true
        }
        if (el.hasAttribute('links')) {
            options.plugins.directajax = {};
        }
        if (el.hasAttribute('remote-url')) {
            var remoteUrl = el.getAttribute('remote-url');
            var remoteGroup = el.hasAttribute('remote-group') ? el.getAttribute('remote-group') : false;
            options.load = function(query, callback) {
                var self = this;
                var results = [];
                if (query.length < 4) {
                    callback(results);
                    return;
                }
                blocking.block();
                request.json({
                    url: remoteUrl,
                    data: {query: query},
                    callback (data) {
                        if (!data) {
                            callback([]);
                            blocking.unblock();
                            return;
                        }
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            item = {
                                title: item.title,
                                href: item.url,
                                id: item.id,
                                description: item.description,
                                score: item.score
                            };
                            if (remoteGroup !== false) item.group = remoteGroup;
                            results.push(item);
                        }
                        if (remoteGroup !== false && !(remoteGroup in self.optgroups)) {
                            self.registerOptionGroup({value: remoteGroup, label: remoteGroup});
                        }
                        callback(results);
                        blocking.unblock();
                    }
                });
            }
        }
        if (data.groups.length) {
            options.optgroups = data.groups
        }
        if ($filters.length) {
            options.plugins.filtering= {
                filters: $filters
            };
        }
        if (el.getAttribute('location')=='simple') {
            var simpleAdressPicker = new SimpleAdressPicker($input, options);
            el.API = simpleAdressPicker.pickerAPI;
        } else {
            el.API = $input.selectize(options)[0].selectize;
        }
        blocking = new Blocker(el.querySelector('.selectize-control'));
        el.API.on('change', function() {
            $el.trigger('change')
        });
        if (!el.hasAttribute('name')) {
            $input.remove();
        }
    }

    static attached (el) {
        var data = el.data,
            $el = $(el),
            $form = $(el).closest('form');
        if (!$form.length) return;
        if (!$form.length || el.hasAttribute('name') || el.hasMultiInputBeenAttached) return;
        el.hasMultiInputBeenAttached = true;
        var add = function(item) {
            $el.closest('form').append('<input type="hidden" name="'+item.input+'" value="'+item.value+'" />');
        };
        var remove = function(item) {
            $el.closest('form').find('input[name="'+item.input+'"][value="'+item.value+'"]').remove();
        };
        for (var i = 0; i < data.initial.length; i++) {
            add(data.initial[i])
        }
        el.API.on('item_add', function(value) {
            add(this.options[value]);
        });
        el.API.on('item_remove', function(value) {
            remove(this.options[value]);
        });
    }

    static properties = {
        value: {
            get(el) {
                if (!el.API) return;
                return el.API.getValue()
            }
        },
        'validate-trigger': {
            get() {
                return 'change'
            }
        }
    };

    select (id) {
        this.API.addItem(id)
    }
}

export class TargetAttribute {
    static extends = 'a';
    static displayName = 'target';
    static type = 'attribute';

    static properties = {
        target: {
            set (el, data) {
                if (data.newValue != 'select-dropdown') return;
                var $trigger = $(el);
                var $target = $($trigger.attr('href'));
                $trigger.click(function(e) {
                    e.preventDefault();
                    $target[0].select($trigger.attr('value'))
                });
            }
        }
    };
}