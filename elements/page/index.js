import './page.scss'
const urlParser = document.createElement('a');
const currentDomain = window.location.host;
import $ from 'jquery';
var url;

export default class {
    static displayName = 'page';
    static ready(el) {
        var loader = document.querySelector('loader[target="page"]');
        var originalLoaderParent = loader.parentNode;
        setTimeout(function(){
            loader.parentNode.removeChild(loader)
        }, 350);
        $(document).delegate( 'a', 'focus', function() {
            url = this.href;
        });
        $(window).on('beforeunload', function() {
            urlParser.href = url;
            if (urlParser.hostname != currentDomain) return;
            originalLoaderParent.appendChild(loader);
            el.removeAttribute('resolved')
        });
    }
}