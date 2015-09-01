require('./proposal.scss');

module.exports = function (componentService) {
    componentService.register('proposal', {
        template: require('./proposal.html'),
        created: function() {

        }
    })
}