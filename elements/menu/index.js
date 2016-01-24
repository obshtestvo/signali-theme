import './menu.scss';
import $ from 'jquery';
import template from './menu.html'

const $document = $(document);

export default class {
    static displayName = 'menu';
    static template = template;

    static attached (el) {
        if (el.hasBeenAttached) return;
        el.hasBeenAttached = true;

        var $el = $(el),
            $lists = $el.find('menu-column ul'),
            isTouchMoving = false;
        var heights = $lists.map(function() {
            return $(this).height('').height()
        }).get();
        var maxHeight = Math.max(...heights);
        $lists.height(maxHeight);


        $(el.querySelector('.trigger')).click(function(){
            el.toggle()
        });

        $document.on('touchmove', function() {
            isTouchMoving = true;
        });

        $document.on('touchend click', function(e) {
            if(!isTouchMoving && !$(e.target).closest($el).length && $el.hasClass('active')) {
                el.toggle()
            }
            isTouchMoving = false;
        });
    }

    toggle() {
        $(this).toggleClass('active');
    }
}