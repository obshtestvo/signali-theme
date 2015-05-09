var selectize = require('selectize/dist/js/standalone/selectize.js');
var $ = require('jquery');
var AddressPicker = require('./addressPicker');
require('./select-dropdown.scss');

module.exports = function (componentService) {
    componentService.register('select-dropdown', {
        template: require('./select-dropdown.html'),
        created: function (el) {
            var $el =  $(el);
            if (el.hasAttribute('location')) {
                var picker = new AddressPicker($el, $('<h1>').get(0));
            } else {
                var values = this.$detachedContent.filter('value');
                var selected = values.filter('[selected]').map(function() {
                    return this.id
                }).get();
                var options = values.map(function() {
                    var $this = $(this)
                    return {id: this.id, title: $this.text()}
                }).get();
                $(el).find('> select').selectize({
                    valueField: 'id',
                    labelField: 'title',
                    searchField: 'title',
                    create: true,
                    options: options,
                    items: selected,
                });
            }
        }
    })
}