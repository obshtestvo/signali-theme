import './card.scss'
import './no-photo.jpg'
import template from './card.html'

export default class {
    static displayName = 'card';
    static template = template;

    static properties = {
        action: {
            attribute: true,
            set (el, data) {
                if (!data.newValue) return;
                el.querySelector('a[main]').setAttribute('href', data.newValue);
            }
        },
        target: {
            attribute: true,
            set (el, data) {
                if (!data.newValue) return;
                el.querySelector('a[main]').setAttribute('target', data.newValue);
            }
        }
    }
}