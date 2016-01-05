import './tip.scss';
import template from './tip.html';
import questionIcon from './questionIcon.svg';

export default class {
    static displayName = 'tip';
    static template = template;
    static include = { questionIcon };
}