import './notification.scss'
import template from './notification.html'
import iconCheck from './check-circle.svg'
import iconExclamation from './exclamation-circle.svg'
import iconInfo from './info-circle.svg'

export default class {
    static displayName = 'notification';
    static template = template;
    static include = { iconCheck, iconExclamation, iconInfo };

    clear () {
        $(this).find('ul,p').remove();
    }
}