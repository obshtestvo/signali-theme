var $ = require('jquery');

var makeRequest = function(url, method, data, dataType, isPjax, options) {
    if (!method) method = 'get';
    if (!options) options = {};
    if (!$.isFunction(options.determineSuccess)) options.determineSuccess = function() {return true};
    if (!$.isFunction(options.success)) options.success = function() {};
    if (!$.isFunction(options.error)) options.error = function() {};
    var requestOptions = {
        url: url,
        type: method,
        dataType: dataType,

        success: function (data) {
            if (options.determineSuccess(data)) {
                options.success(data)
            } else {
                options.error(data)
            }
        },

        error: function (xhr, status, err) {
            var error = err;
            if (xhr.responseText) error = xhr.responseText;
            if (dataType =='json' && xhr.responseJSON) {
                error = xhr.responseJSON;
            }
            options.error(error)
        }
    };
    if (data) requestOptions.data = data;
    if (isPjax) requestOptions.headers = {"x-pjax": 1};
    return $.ajax(requestOptions);
};

module.exports = {
    pjax: function(url, method, data, options) {
        if ($.isFunction(method)) {
            options = {};
            options.success = method;
            options.error = method;
            method = 'get';
        }
        return makeRequest(url, method, data, 'html', true, options)
    },
    json: function(url, method, data, options) {
        if ($.isFunction(method)) {
            options = {};
            options.success = method;
            options.error = method;
            method = 'get';
        }
        return makeRequest(url, method, data, 'json', false, options)
    }
};
