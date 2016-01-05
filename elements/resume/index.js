import './resume.scss'
import template from './resume.html'
import tagsIcon from './icon-tags.svg'
import pinIcon from './icon-pin.svg'

export default class {
    static displayName = 'resume';
    static template = template;
    static include = { tagsIcon, pinIcon };
}