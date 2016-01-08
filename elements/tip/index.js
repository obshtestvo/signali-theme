import 'tooltipster/js/jquery.tooltipster';
import './tip.scss';
import template from './tip.html';
import questionIcon from './questionIcon.svg';

const $document = $(document);

export default class {
    static displayName = 'tip';
    static template = template;
    static include = { questionIcon };

    static ready (el) {
        var $el = $(el),
            $container = $el.closest('[tip-container]'),
            isTouchMoving = false;
        if (!$container.length) {
            $container = $(el.querySelector('svg'))
        }

        $document.on('touchmove', function() {
            isTouchMoving = true;
        });

        $container.mousedown(function() {
            if (!$el.hasClass("active")) {
                $el.addClass('active');
                $container.tooltipster('show')
            }
        });
        $document.on('touchend mousedown', function(e) {
            if(!isTouchMoving && !$(e.target).closest('.tooltipster-base').length && $el.hasClass("active")) {
                $container.tooltipster('hide')
                $el.removeClass('active');
            }
            isTouchMoving = false;
        });
        $container.tooltipster({
            theme: `tooltipster-signali ${el.getAttribute('size')} ${el.getAttribute('color')}`,
            animation: 'grow',
            arrowColor: '____',
            touchDevices: false,
            contentCloning: false,
            speed: 250,
            interactive: true,
            autoClose: false,
            trigger: 'custom',
            content: $(el.querySelector('.content')).clone().removeAttr('hidden').removeAttr('style')
        });
    }
}