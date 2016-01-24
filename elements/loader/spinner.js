import Spinner from 'spin.js';
import deepmerge from 'deepmerge';
import './spinner.scss';

export default function (container, overrideOptions = {}) {
    var spinner = new Spinner(deepmerge({
        lines: 40, // The number of lines to draw
        length: 0, // The length of each line
        width: 5, // The line thickness
        radius: 7, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        color: 'invalid', // Set to invalid in order to be able to set it in the CSS. Usually #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 50, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true // Whether to use hardware acceleration
    }, overrideOptions));
    if (container) container.spin(container);
    return spinner;
}
