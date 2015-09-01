require('./page.scss')

module.exports = function (componentService) {
    componentService.register('page', {
        created: function() {
            var loader = document.querySelector('loader[target="page"]');
            setTimeout(function(){
                loader.parentNode.removeChild(loader)
            }, 100);
        }
    })
}