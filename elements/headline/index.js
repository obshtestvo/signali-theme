import './headline.scss'
import template from './headline.html'

export default class {
    static displayName = 'headline';
    static template = template;

    setTitle (title) {
        if (typeof title == 'string') title = document.createTextNode(title)
        this.clearContent();
        this.appendChild(title);
    }

    setSubtitle (html) {
        var subtitle = this.querySelector('p');
        if (!subtitle) {
            subtitle = document.createElement('p');
            this.appendChild(subtitle);
        }
        subtitle.innerHTML = html
    }
}