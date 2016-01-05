import './menu.scss';
import $ from 'jquery';
import template from './menu.html'

export default class {
    static displayName = 'menu';
    static template = template;

    static attached (el) {
        if (el.hasBeenAttached) return;
        el.hasBeenAttached = true;

        var $el = $(el);
        var $lists = $el.find('menu-column ul');
        var heights = $lists.map(function() {
            return $(this).height('').height()
        }).get();
        var maxHeight = Math.max(...heights);
        $lists.height(maxHeight);


        $(el.querySelector('.trigger')).click(function(){
            el.toggle()
        });

        $(document).on('click touchend', function(event) {
            if(!$(event.target).closest($el).length && $el.hasClass("active")) {
                el.toggle()
            }
        });
    }

    toggle() {
        $(this).toggleClass('active');
    }
}