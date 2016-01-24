import './action-button.scss';
import template from './action-button.html';
import arrow from './chevron-circle-right.svg';
import arrowBlack from './chevron-circle-left.svg';
import replyIcon from './reply.svg';
const slice = [].slice;

export default class {
    static displayName = 'action-button';
    static template = template;
    static include = {
        'arrow': arrow,
        'arrow-back': arrowBlack,
        'reply-icon': replyIcon
    };
    static properties = {
        action: {
            attribute: true,
            set (el, data) {
                if (!data.newValue && !data.oldValue) return;
                slice.call(el.querySelectorAll('a')).map(a => {
                    a.setAttribute('href', data.newValue)
                })
            }
        },
        target: {
            attribute: true,
            set (el, data) {
                if (!data.newValue && !data.oldValue) return;
                slice.call(el.querySelectorAll('a')).map(a => {
                    a.setAttribute('target', data.newValue)
                })
            }
        }
    };
}