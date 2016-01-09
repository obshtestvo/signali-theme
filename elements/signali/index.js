// require all files from `autorequire` subdirectories
require.context("../", true, /\/autorequire\//)

// jquery plugins are not all used to CommonJS or AMD
window.$ = window.jQuery = require('jquery');
//require('core-js/es6/symbol');

require('html5-history-api');

if (!Modernizr.es6object || !Modernizr.mutationobserver) {
    require(['babel-polyfill', 'mutation-observer'], () => {
        window.MutationObserver = require('mutation-observer');
        require('./elements')
    });
} else {
    require('./elements')
}