var selectize = require('selectize/dist/js/standalone/selectize.js');

selectize.define('multiple_inputs', function (settings) {
    var self = this;
    this.updateOriginalInput = (function () {
        var original = self.updateOriginalInput;
        return function () {
            var ret = original.apply(this, arguments);
            var option, inputName, i, n, optionsHTMLByInput = {};
            for (i = 0, n = self.items.length; i < n; i++) {
                option = self.options[self.items[i]];
                inputName = option.input;
                if (!optionsHTMLByInput[inputName]) optionsHTMLByInput[inputName] = [];
                optionsHTMLByInput[inputName].push('<option value="' + option.value + '" selected="selected"></option>');
            }
            for (inputName in optionsHTMLByInput) {
                settings.inputMap[inputName].html(optionsHTMLByInput[inputName].join(''));
            }
            return ret;
        };
    })();
});