require('./page.scss')

module.exports = function (componentService) {
    componentService.register('page', {
        created: function() {
            var el = this;
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
    })
};