import $ from 'jquery';
import 'magnific-popup/dist/jquery.magnific-popup';
//require('magnific-popup/src/js/core.js'); //@todo investigate: can cause `no mfp found`
//require('magnific-popup/src/js/inline.js'); //@todo investigate: can cause `no mfp found`
import 'magnific-popup/dist/magnific-popup.css';
import './magnific-popup-override.scss';
import './modal.scss';
import './modal-inline.scss';
import modalTemplate from './modal.html';
import modalScreenTemplate from './modal-screen.html';
import closeIcon from './close.svg';


$(window).on('beforeunload', function() {
    $.magnificPopup.close();
});

export class ModalElement {
    static displayName = 'modal';
    static template = modalTemplate;
    static include = {
        close: closeIcon
    };

    static created(el) {
        $(el).on('click', '.close-modal', function (e) {
            e.preventDefault();
            el.close();
        });
    }

    static properties = {
        primary: {
            get(el) {
                return el.querySelector('[priority="primary"]')
            }
        }
    };

    attach () {
        var hiddenContainer = document.querySelector('[modal-hider]');
        if (!hiddenContainer) {
            $('<div modal-hider>').appendTo($('body'))
        }
        hiddenContainer.appendChild(this)
    }

    cloneModal () {
        var clone = this.clone();
        return $(clone).removeClass('mfp-hide')[0]
    }

    close () {
        $.magnificPopup.close();
    }

    show () {
        var delay = 300;
        var $el = $(this);
        $.magnificPopup.open({
            items: {
                src: $el,
                type: 'inline',
            },
            callbacks: {
                open () {
                    setTimeout(function(){
                        $el.trigger('modal:open')
                    }, delay)
                },
                close () {
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
    }

    appendSecondary (content, skipPadding) {
        var screen = '<modal-screen></modal-screen>';
        if (skipPadding) screen = '<modal-screen no-padding></modal-screen>';
        var $screen = $(screen).append(content).addClass('secondary');
        this.appendChild($screen[0]);
        return $screen[0];
    }
}

export class ModalScreenElement {
    static displayName = 'modal-screen';
    static template = modalScreenTemplate;
}

export class TargetAttribute {
    static displayName = 'target';
    static extends = 'a';
    static type = "attribute";

    static properties = {
        target: {
            attribute: true,
            set (element, data) {
                if (data.newValue != 'modal') return;
                if (element.hasPopupTrigger) return;
                element.hasPopupTrigger = true;
                var $el = $(element);
                $el.on('click.modal-target', function(e) {
                    e.preventDefault();
                    var $modal = $($(this).attr('href'));
                    $modal[0].show();
                });
            }
        }
    }
}