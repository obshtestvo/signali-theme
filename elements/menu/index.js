var $ = require('jquery');
require('./menu.scss');

module.exports = function (componentService) {
    componentService.register('menu', {
        template: require('./menu.html'),
        attached: function () {
            var el = this,
                $el = $(el);
            var $lists = $el.find('menu-column ul');
            var heights = $lists.map(function() {
                return $(this).height('').height()
            }).get();
            var maxHeight = Math.max.apply(null, heights);
            $lists.height(maxHeight);

            if (this.hasBeenAttached) return;
            this.hasBeenAttached = true;

            $(this.querySelector('.trigger')).click(function(){
                el.toggle()
            });

            $(document).on('click touchend', function(event) {
                if(!$(event.target).closest($el).length && $el.hasClass("active")) {
                    el.toggle()
                }
            });
        },
        prototype: {
            toggle: function() {
                $(this).toggleClass('active');
            }
        }
    })
}