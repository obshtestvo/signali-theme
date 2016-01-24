import './card-item.scss';
import template from './card-item.html';

export default class {
    static displayName = 'card-item';
    static template = template;
    static properties = {
        "tags": {
            get (el) {
                return el.getAttribute('type') == 'tags'
            }
        },
        "rating": {
            get (el) {
                return el.getAttribute('type') == 'rating'
            }
        }
    };
}