import './tabs.scss';
import 'service/jquery.animateContentSwitch';
import $ from 'jquery';
import toggleFixedHeight from 'service/toggleFixedHeight';
import template from './tabs.html';

export default class {
    static displayName = 'tabs';
    static template = template;

    static ready (el) {
        if (el.hasAttribute('links')) return;
        var $tabLinks = $(el).find('a');
        $tabLinks.each(function() {
            var $link = $(this),
                $container,
                $toHide,
                $target;
            $link.click(function(e) {
                e.preventDefault();

                $target = $($link.attr('href'));
                $container = $target.parent();
                $toHide = $container.children('[tab]:visible').eq(0);
                if ($toHide.is($target)) return;

                $tabLinks.removeClass('active');
                $link.addClass('active');

                toggleFixedHeight($container, true);
                $container.animateContentSwitch($container.children('[tab]:visible').eq(0), $target, {
                    width: false,
                    speed: 200,
                    final: function () {
                        toggleFixedHeight($container, false)
                    }
                });
            });
        })
    }
}