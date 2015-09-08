require('./card.scss');
require('./no-photo.jpg');

module.exports = function (componentService) {
    componentService.register('card', {
        template: require('./card.html')
    })
}