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
                var options = values.map(function() {
                    var $this = $(this)
                    return {id: this.id, title: $this.text()}
                }).get();
                $input.selectize({
                    valueField: 'id',
                    labelField: 'title',
                    searchField: 'title',
                    plugins: el.hasAttribute('multiple') ? ['remove_button'] : [],
                    create: true,
                    options: options,
                    items: selected
                });
            }
        }
    })
}