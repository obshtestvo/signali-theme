import './crumb.scss'
import template from './crumb.html'
import arrow from './arrow.svg'

export default class {
    static displayName = 'crumb';
    static template = template;
    static include = { arrow };
}