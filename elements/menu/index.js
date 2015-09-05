var $ = require('jquery');
require('./menu.scss');

module.exports = function (componentService) {
    componentService.register('menu', {
        template: require('./menu.html'),
        attached: function () {
            if (this.hasBeenAttached) return;
            this.hasBeenAttached = true;
            var el = this,
                $el = $(el);

            $(this.querySelector('.trigger')).click(function(){
                el.toggle()
            });

            $(document).click(function(event) {
                if(!$(event.target).closest($el).length && $el.hasClass("active")) {
                    el.toggle()
                }
            });

            var $lists = $el.find('.categories ul');
            var heights = $lists.map(function() {
                return $(this).height()
            }).get();
            var maxHeight = Math.max.apply(null, heights);
            $lists.height(maxHeight);
        },
        prototype: {
            toggle: function() {
                $(this).toggleClass('active');
            }
        }
    })
}