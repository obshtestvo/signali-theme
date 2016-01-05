import './preloader.scss'
import template from './preloader.html'

export default class PreloaderElement {
    static displayName = 'preloader';
    static template = template;
}

export function generate(container) {
    var preloader = document.createElement('preloader');
    if (container) container.appendChild(preloader);
    return preloader;
}