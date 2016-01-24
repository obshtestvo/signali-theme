import 'animate.css/source/_base.css';
import 'animate.css/source/flippers/flipInX.css';
import 'animate.css/source/fading_exits/fadeOut.css';
import 'animate.css/source/fading_entrances/fadeInUp.css';
import './bubble.scss';
import $ from 'jquery';
import iconCheck from './check-circle.svg';
import iconExclamation from './exclamation-circle.svg';
import iconInfo from './info-circle.svg';
import iconClose from './close.svg';
import template from './bubble.html';
import handleModals from './element-adaptors/modal';

var container = document.createElement('div');
var $container = $(container);
container.setAttribute('bubble-container', '');
document.getElementsByTagName('body')[0].appendChild(container);
handleModals($container);

export default class {
    static displayName = 'bubble';
    static template = template;
    static include = { iconCheck, iconExclamation, iconInfo, iconClose };

    static created (el) {
        el.showClass = 'fadeInUp';
        el.hideClass = 'fadeOut';
        el.animationDuration = 700;
        el.showDuration = 2400;
        var $this = $(el);

        $this.click(function() {
            this.hide()
        });
        $this.hover(function() {
            $this.removeClass(this.hideClass);
            clearTimeout(this.timeout);
        }, function() {
            this.autoclose()
        });
    }

    static properties = {
        'information': {
            get (el) {
                return el.getAttribute('type')=='information'
            }
        },
        'success': {
            get (el) {
                return el.getAttribute('type') == 'success'
            }
        },
        'error': {
            get (el) {
                return el.getAttribute('type')=='error'
            }
        }
    };

    autoclose () {
        var self = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
            self.hide();
        }, this.showDuration)
    }

    show () {
        this.autoclose();
        document.querySelector('[bubble-container]').appendChild(this);
        $(this).show()
    }

    hide () {
        var $this = $(this);
        $this.removeClass(this.showClass);
        $this.addClass(this.hideClass);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
            $this.remove()
        }, this.animationDuration)
    }
}