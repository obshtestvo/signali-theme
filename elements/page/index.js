import './page.scss'

export default class {
    static displayName = 'page';
    static ready(el) {
        var loader = document.querySelector('loader[target="page"]');
        var originalLoaderParent = loader.parentNode;
        setTimeout(function(){
            loader.parentNode.removeChild(loader)
        }, 350);
        window.onbeforeunload = function() {
            originalLoaderParent.appendChild(loader);
            el.removeAttribute('resolved')
        }
    }
}