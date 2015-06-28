require('./modal.scss')

module.exports = function (componentService) {
    componentService.register('modal', {
        template: require('./modal.html'),
        include: {
            close: require('./close.svg')
        },
        created: function () {
            $(this).find('#close-modal').click(function(){
                $('fader').hide(400);
            })
        }
    })
}