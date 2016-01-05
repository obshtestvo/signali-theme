import './social-button.scss'
import template from './social-button.html'
import facebookIcon from './facebook.svg'
import googleIcon from './googleplus.svg'
import arrow from './long-arrow-right.svg'

export default class {
    static displayName = 'social-button';
    static template = template;
    static include = { facebookIcon, googleIcon, arrow };
}