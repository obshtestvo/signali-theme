require('./preloader.scss');

module.exports = {
    init: function(componentService) {
        componentService.register('preloader', {
            template: require('./preloader.html')
        })
    },
    generate: function (container) {
        var preloader  = document.createElement('preloader');
        if (container) container.appendChild(preloader);
        return preloader;
    }
};