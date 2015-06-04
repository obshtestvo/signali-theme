require('./menu.scss')

module.exports = function (componentService) {
    componentService.register('menu', {
        template: require('./menu.html'),
        created: function (el) {
            $(el).find('.trigger').click(function(){
                $(this).toggleClass('active')
                $(".categories").toggleClass('active')
            })
        }
    })
}