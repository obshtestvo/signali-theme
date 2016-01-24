import './login-box.scss'
import template from './login-box.html'
import iconUser from './user.svg'


function is_touch_device() {
    return (('ontouchstart' in window)
    || (navigator.MaxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0));
}


export default class {
    static displayName = 'login-box';
    static template = template;
    static include = { iconUser };

    static ready (el) {
        if (!el.hasAttribute('anonymous') && is_touch_device()) {
            var trigger = el.querySelector('a');
            trigger.removeAttribute('href');
            trigger.removeAttribute('target');
        }
    }
}