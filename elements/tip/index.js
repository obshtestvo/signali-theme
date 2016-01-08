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

        $document.on('touchend mousedown', function(e) {
            var $target = $(e.target);
            if(!isTouchMoving && $el.hasClass("active")) {
                if ($target.closest('.tooltipster-base').length || $target.closest($container).length) {
                    return;
                }
                $container.tooltipster('hide');
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
        $container.click(function() {
            if (!$el.hasClass("active")) {
                $el.addClass('active');
                $container.tooltipster('show')
            } else {
                $container.tooltipster('hide')
                $el.removeClass('active');
            }
        });
    }
}