var Spinner = require('spin.js');
var deepmerge= require('deepmerge');

module.exports = function(overrideOptions) {
    overrideOptions = overrideOptions || {};
    return new Spinner(deepmerge({
        lines: 40, // The number of lines to draw
        length: 0, // The length of each line
        width: 5, // The line thickness
        radius: 7, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        color: '#F26426', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 50, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true // Whether to use hardware acceleration
    }, overrideOptions || {}))
};