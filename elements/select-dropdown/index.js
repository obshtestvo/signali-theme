var $ = require('jquery');
var addressSearch = require('./addressPicker');
var request = require('ajax/request');
var Blocker = require('ajax/block');
require('selectize/dist/js/standalone/selectize.js');
require('./selectize.filtering.js');
require('./selectize.directajax.js');
require('./select-dropdown.scss');

module.exports = function (componentService) {
    componentService.register('select-dropdown', {
        template: require('./select-dropdown.html'),
        created: function () {
            var el = this,
                $el = $(el),
                $input = $el.find('> select'),
                $filters = $el.find('.filters'),
                isMultiple = el.hasAttribute('multiple'),
                blocking;

            if (el.getAttribute('location')=='google') {
                el.API = new addressSearch.Google($input, $('<h1>').get(0));
                return;
            }

            var data = extractData(el.$detachedContent.filter('value'));
            el.data = data;

            var options = {
                valueField: 'id',
                labelField: 'title',
                selectOnTab: true,
                score: function(search) {
                    var textScore = this.getScoreFunction(search);
                    return function(item) {
                        var score =  textScore(item);
                        if (item.score) {
                            score = score * (1+item.score)
                        }
                        return score;
                    };
                },
                searchField: 'title',
                optgroupField: 'group',
                options: data.choices,
                items: data.selected,
                render: {
                    option: function(item, escape) {
                        return '<div class="'+(item.class ? item.class : '')+'">' +
                            (item.prefix ? '<span class="prefix">' + escape(item.prefix) + '</span>': '') +
                             '<span class="caption">' + escape(item.title) + '</span>' +
                            (item.suffix ? '<span class="suffix">' + escape(item.suffix) + '</span>': '') +
                            '</div>';
                    }
                },
                plugins: {
                    //no_results: {}
                }
            };

            if (isMultiple) {
                options.plugins.remove_button =  {
                    label: require('icons/times-circle.svg')
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
                options.plugins.directajax =  {};
                var remoteUrl = el.getAttribute('remote-url')
                var remoteGroup = el.hasAttribute('remote-group') ? el.getAttribute('remote-group') : false;
                options.load = function(query, callback) {
                    var self = this;
                    blocking.block();
                    request.json(remoteUrl, function(data) {
                        var results = [];
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
                                id: item.url,
                                description: item.description,
                                score: item.score
                            }
                            if (remoteGroup !== false) item.group = remoteGroup;
                            results.push(item);
                        }
                        if (!(remoteGroup in self.optgroups)) {
                            self.registerOptionGroup({value: remoteGroup, label: remoteGroup});
                        }
                        callback(results);
                        blocking.unblock();
                    }, {query: query});
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
            $(document).on('touchend click', function(event) {
                if(!$(event.target).closest($el).length) {
                    el.API.blur();
                    el.API.close();
                }
            });
            if (el.getAttribute('location')=='simple') {
                el.API = new addressSearch.Simple($input, options);
                return;
            }
            el.API = $input.selectize(options)[0].selectize;
            blocking = new Blocker(el.querySelector('.selectize-control'));
            el.API.on('change', function() {
                $el.trigger('change')
            });
            if (!el.hasAttribute('name')) {
                $input.remove();
            }
        },
        attached: function() {
            var el = this,
                data = el.data,
                $el = $(el),
                $form = $(el).closest('form');;
            if (!$form.length) return;
            if (!$form.length || el.hasAttribute('name') || this.hasMultiInputBeenAttached) return;
            this.hasMultiInputBeenAttached = true;
            var add = function(item) {
                $el.closest('form').append('<input type="hidden" name="'+item.input+'" value="'+item.value+'" />');
            };
            var remove = function(item) {
                $el.closest('form').find('input[name="'+item.input+'"][value="'+item.value+'"]').remove();
            };
            for (var i = 0; i < data.initial.length; i++) {
                add(data.initial[i])
            }
            el.API.on('item_add', function(value, $item) {
                add(this.options[value]);
            });
            el.API.on('item_remove', function(value, $item) {
                remove(this.options[value]);
            });
        },
        prototype: {
            select: function(id) {
                this.API.addItem(id)
            }
        },
        properties: {
            value: {
                get: function() {
                    if (!this.API) return;
                    return this.API.getValue()
                }
            },
            "validate-trigger": {
                get: function() {
                    return 'change'
                }
            }
        }
    });

    componentService.register('target', {
        extends: 'a',
        type: 'attribute',
        properties: {
            target: {
                set: function (newValue) {
                    if (newValue != 'select-dropdown') return;
                    var $trigger = $(this);
                    var $target = $($trigger.attr('href'));
                    $trigger.click(function(e) {
                        e.preventDefault();
                        $target[0].select($trigger.attr('value'))
                    });
                }
            }
        }
    });
};


var extractData = function($values) {
    var groups = [];
    var selected = [];
    var initial = [];
    var choices = $values.map(function() {
        if (!this.id) this.id = 'select-dropdown-' + Math.floor(Math.random() * 1000) + '-' + Date.now()
        var item = {id: this.id, value: this.id, title: $(this).text()};
        if (this.hasAttribute('group')) {
            var group = this.getAttribute('group');
            item.group = group;
            groups.push({value: group, label: group})
        }
        if (this.hasAttribute('prefix')) {
            item.prefix = this.getAttribute('prefix');
        }
        if (this.hasAttribute('current')) {
            item["class"] = 'current';
        }
        if (this.hasAttribute('class')) {
            item["class"] = this.getAttribute('class');
        }
        if (this.hasAttribute('href')) {
            item.href = this.getAttribute('href');
        }
        if (this.hasAttribute('suffix')) {
            item.suffix = this.getAttribute('suffix');
        }
        if (this.hasAttribute('input')) {
            item.input = this.getAttribute('input');
            item.id = this.getAttribute('site-wide-id')
        }
        if (this.hasAttribute('selected')) {
            selected.push(item.id);
            initial.push(item);
        }
        return item
    }).get();

    return {
        groups: groups,
        choices: choices,
        initial: initial,
        selected: selected
    }
};