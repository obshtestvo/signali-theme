import './login-box.scss'
import template from './login-box.html'
import iconUser from './user.svg'

export default class {
    static displayName = 'login-box';
    static template = template;
    static include = { iconUser }
}