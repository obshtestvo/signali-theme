require('./card.scss');
require('./no-photo.jpg');

module.exports = function (componentService) {
    componentService.register('card', {
        template: require('./card.html'),
        properties: {
            action: {
                attr: true,
                set: function(value) {
                    this.querySelector('a[main]').setAttribute('href', value);
                }
            },
            target: {
                attr: true,
                set: function(value) {
                    this.querySelector('a[main]').setAttribute('target', value);
                }
            }
        }
    })
}