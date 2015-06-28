require('magnific-popup/dist/jquery.magnific-popup');
require('magnific-popup/dist/magnific-popup.css');
require('./magnific-popup-override.scss');

module.exports = function (componentService) {
    componentService.register('target', {
        extends: 'a',
        type: 'attribute',
        // Called when an attribute is created, updated or removed.
        attribute: function (name, oldValue, newValue) {
            if (name != 'target' || newValue != 'popup') return;
            var $trigger = $(this)
            $trigger.magnificPopup({
                type: 'inline',
                showCloseBtn: false,
                // Delay in milliseconds before popup is removed
                removalDelay: 300,
                // Class that is added to popup wrapper and background
                // make it unique to apply your CSS animations just to this exact popup
                mainClass: 'mfp-zoom-in',
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });
            $($trigger.attr('href')).on( 'click', '[id^="close"]', function(e) {
                e.preventDefault();
                $.magnificPopup.close();
            });
        }
    })
}