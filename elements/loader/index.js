require('./loader.scss');

module.exports = function (componentService) {
    require('./preloader').init(componentService)
}