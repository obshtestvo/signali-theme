require('service/jquery.animateContentSwitch.js');
var toggleFixedHeight = require('service/toggleFixedHeight.js');

require('./tabs.scss');

module.exports = function (componentService) {
    var name = 'tabs';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./tabs.html'),
        created: function() {
            if (this.hasAttribute('links')) return;
            var $tabLinks = $(this).find('a');
            $tabLinks.each(function() {
                var $link = $(this);
                var $target = $($link.attr('href'));
                $link.click(function(e) {
                    var $container = $target.parent();
                    e.preventDefault();
                    var $toHide = $container.children('[tab]:visible').eq(0);
                    if ($toHide.is($target)) return;
                    $tabLinks.removeClass('active');
                    $link.addClass('active');
                    toggleFixedHeight($container, true);
                    $container.animateContentSwitch($container.children('[tab]:visible').eq(0), $target, {
                        width: false,
                        speed: 100,
                        final: function () {
                            toggleFixedHeight($container, false)
                        }
                    });
                });
            })
        }
    })
};