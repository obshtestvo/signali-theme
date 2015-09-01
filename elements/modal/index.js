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
        properties: {
            primary: {
                get: function() {
                    return $(this).children('[wrapper]').children('[priority="primary"]')[0]
                }
            }
        },
        prototype: {
            attach: function() {
                var hiddenContainer = document.querySelector('[modal-hider]')
                if (!hiddenContainer) {
                    $('<div modal-hider>').appendTo($('body'))
                }
                hiddenContainer.appendChild(this)
            },

            cloneModal: function() {
                var clone = this.cloneNode(true);
                return $(clone).removeClass('mfp-hide')[0]
            },

            close: function() {
                $.magnificPopup.close();
            },

            show: function() {
                var delay = 300;
                var $el = $(this);
                $.magnificPopup.open({
                    items: {
                        src: $el,
                        type: 'inline',
                    },
                    callbacks: {
                        open: function() {
                            setTimeout(function(){
                                $el.trigger('modal:open')
                            }, delay)
                        },
                        close: function() {
                            setTimeout(function(){
                                $el.trigger('modal:close')
                            }, delay)
                        }
                    },
                    showCloseBtn: false,
                    // Delay in milliseconds before popup is removed
                    removalDelay: delay,
                    // Class that is added to popup wrapper and background
                    // make it unique to apply your CSS animations just to this exact popup
                    mainClass: 'mfp-zoom-in',
                    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                });
            },

            addSecondary: function(content) {
                $(this).children('[wrapper]').children('[priority="secondary"]').append(content)
            }
        }
    });

    componentService.register('target', {
        extends: "a",
        type: "attribute",
        properties: {
            target: {
                attr: true,
                set: function (newValue) {
                    if (newValue != 'modal') return;
                    if (this.hasPopupTrigger) return;
                    this.hasPopupTrigger = true;
                    var $el = $(this);
                    $el.click(function(e){
                        e.preventDefault();
                        var $modal = $($(this).attr('href'));
                        $modal[0].show();
                    });
                }
            }
        }
    });
};