import './text-field.scss';
import template from './text-field.html';
import $ from 'jquery';

export default class {
    static displayName = 'text-field';
    static template = template;
    static properties = {
        'textarea': {
            get (el) {
                return el.getAttribute('type')=='textarea'
            }
        },
        'value': {
            get (el) {
                var $el = $(el);
                var $input = $el.find('input, textarea');
                return $input.val()
            }
        },
        'validate-trigger': {
            get () {
                return 'input keyup'
            }
        }
    };
}