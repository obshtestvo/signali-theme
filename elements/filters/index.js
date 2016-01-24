import './filters.scss';
import template from './filters.html';
import downIcon from './icon-down.svg';
import upIcon from './icon-up.svg';
import $ from 'jquery';

export default class {
    static displayName = 'filters';
    static template = template;
    static include = { downIcon, upIcon };
    static ready(el) {
        var $collapseTrigger = $(el.querySelector('div'));

        $collapseTrigger.on('click', function() {
            if (el.hasAttribute('expanded')) {
                el.removeAttribute('expanded')
            } else {
                el.setAttribute('expanded', '')
            }
        })
    }
}