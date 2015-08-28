require('magnific-popup/dist/jquery.magnific-popup');
require('magnific-popup/dist/magnific-popup.css');
require('./magnific-popup-override.scss');
require('./modal.scss');

module.exports = function (componentService) {

    componentService.register('modal', {
        template: require('./modal.html'),
        include: {
            close: require('./close.svg')
        },
        created: function () {
            var el = this;
            $(el).on( 'click', '.close-modal', function(e) {
                e.preventDefault();
                el.close();
            });
        },
        prototype: {
            close: function() {
                $.magnificPopup.close();
            },
            show: function() {
                var delay = 300;
                var self = this;
                $.magnificPopup.open({
                    items: {
                        src: $(self),
                        type: 'inline',
                    },
                    showCloseBtn: false,
                    // Delay in milliseconds before popup is removed
                    removalDelay: delay,
                    // Class that is added to popup wrapper and background
                    // make it unique to apply your CSS animations just to this exact popup
                    mainClass: 'mfp-zoom-in',
                    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                });
            }
        }
    });

    componentService.register('target', {
        extends: "a",
        type: "attribute",
        properties: {
            target: {
                attr: true,
                "set": function (newValue) {
                    if (newValue != 'modal') return;
                    var $trigger = $(this);
                    var delay = 300;
                    $trigger.magnificPopup({
                        type: 'inline',
                        showCloseBtn: false,
                        // Delay in milliseconds before popup is removed
                        removalDelay: delay,
                        // Class that is added to popup wrapper and background
                        // make it unique to apply your CSS animations just to this exact popup
                        mainClass: 'mfp-zoom-in',
                        callbacks: {
                            open: function() {
                                setTimeout(function(){
                                    $trigger.trigger('done')
                                }, delay)
                            }
                        },
                        midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                    });
                }
            }
        }
    });
};