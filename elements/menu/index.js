var $ = require('jquery');
require('./menu.scss');

module.exports = function (componentService) {
    componentService.register('menu', {
        template: require('./menu.html'),
        created: function () {
            var $el = $(this)
            $el.find('.trigger').click(function(){
                $(this).toggleClass('active')
                $(".categories").toggleClass('active')
            })

            var $lists = $el.find('.categories ul');

            var heights = $lists.map(function() {
                console.log($(this).height())
                return $(this).height()
            }).get();

            var maxHeight = Math.max.apply(null, heights);
            $lists.height(maxHeight);
        }
    })
}