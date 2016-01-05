import './checkbox.scss'
import template from './checkbox.html'
import tick from './tick.svg'

export default class {
    static displayName = 'checkbox';
    static template = template;
    static include = { tick };
    static properties =  {
        "empty-value": {
            get (el) {
                return el.getAttribute('value') == ''
            }
        }
    }
}