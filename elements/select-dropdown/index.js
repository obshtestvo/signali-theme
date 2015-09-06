var $ = require('jquery');
var addressSearch = require('./addressPicker');
require('selectize/dist/js/standalone/selectize.js');
require('./selectize.filtering.js');
require('./selectize.multiple_inputs.js');
require('./select-dropdown.scss');

module.exports = function (componentService) {
    componentService.register('select-dropdown', {
        template: require('./select-dropdown.html'),
        created: function () {
            var el = this,
                $el = $(el),
                $input = $el.find('> select'),
                $filters = $el.find('.filters'),
                isMultiple = el.hasAttribute('multiple');

            if (el.getAttribute('location')=='google') {
                this.API = new addressSearch.Google($input, $('<h1>').get(0));
                return;
            }

            var data = extractData(this.$detachedContent.filter('value'));
            var options = {
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                optgroupField: 'group',
                options: data.choices,
                items: data.selected,
                plugins: {}
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
            if (data.groups.length) {
                options.optgroups = data.groups
            }
            if ($filters.length) {
                options.plugins.filtering= {
                    filters: $filters
                };
            }
            if (!el.hasAttribute('name')) {
                var inputMap = {}, inputName, selectEl, i;
                for (i = 0; i < data.inputNames.length; i++) {
                    inputName = data.inputNames[i];
                    selectEl = document.createElement("select");
                    selectEl.setAttribute('name', inputName);
                    if (isMultiple) selectEl.setAttribute('multiple', '');
                    el.appendChild(selectEl);
                    inputMap[inputName] = $(selectEl)
                }
                options.plugins.multiple_inputs = {
                    inputMap: inputMap
                };
            }
            if (el.getAttribute('location')=='simple') {
                this.API = new addressSearch.Simple($input, options);
                return;
            }
            this.API = $input.selectize(options)[0].selectize;
            this.API.on('change', function() {
                $el.trigger('change')
            })
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
    var inputNames = [];
    var groups = [];
    var choices = $values.map(function() {
        var item = {id: this.id, value: this.id, title: $(this).text()};
        if (this.hasAttribute('group')) {
            var group = this.getAttribute('group');
            item.group = group;
            groups.push({value: group, label: group})
        }
        if (this.hasAttribute('input')) {
            var inputName = this.getAttribute('input');
            if (inputNames.indexOf(inputName) === -1) {
                inputNames.push(inputName)
            }
            item.input = inputName;
            item.id = this.getAttribute('site-wide-id')
        }
        return item
    }).get();
    var selected = $values.filter('[selected]').map(function() {
        return this.id
    }).get();
    return {
        groups: groups,
        choices: choices,
        selected: selected,
        inputNames: inputNames
    }
};