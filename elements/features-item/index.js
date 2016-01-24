import './features-item.scss';
import checkCircle from './check-circle.svg';
import closeCircle from './close.svg';
import questionCircle from './question.svg';
import template from './features-item.html';

export default class {
    static displayName = 'features-item';
    static template = template;
    static include = { checkCircle, closeCircle, questionCircle };

    static properties = {
        "check": {
            get: function (el) {
                return el.getAttribute('type')=='check'
            }
        },
        "none": {
            get: function (el) {
                return el.getAttribute('type')=='none'
            }
        },
        "question": {
            get: function (el) {
                return el.getAttribute('type')=='question'
            }
        }
    };
}