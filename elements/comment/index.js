import './comment.scss'
import template from './comment.html'
import circle from './circle.svg'

export default class {
    static displayName = 'comment';
    static template = template;
    include = { circle }
}