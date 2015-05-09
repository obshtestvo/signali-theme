var selectize = require('selectize/dist/js/standalone/selectize.js');
var $ = require('jquery');
var AddressPicker = require('./addressPicker');
require('./select-dropdown.scss');

module.exports = function (componentService) {
    componentService.register('select-dropdown', {
        template: require('./select-dropdown.html'),
        created: function (el) {
            var $input =  $(el).find('> select');
            if (el.hasAttribute('location')) {
                var picker = new AddressPicker($input, $('<h1>').get(0));
            } else {
                var values = this.$detachedContent.filter('value');
                var selected = values.filter('[selected]').map(function() {
                    return this.id
                }).get();
                var choices = values.map(function() {
                    var $this = $(this)
                    return {id: this.id, title: $this.text()}
                }).get();

                var options = {
                    valueField: 'id',
                    labelField: 'title',
                    searchField: 'title',
                    create: true,
                    options: choices,
                    items: selected
                }
                if (el.hasAttribute('multiple')) {
                    options.plugins = {
                        remove_button: {
                            label: require('./close.svg')
                        }
                    }
                }
                $input.selectize(options);
            }
        }
    })
}