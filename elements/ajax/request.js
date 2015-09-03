var $ = require('jquery');
var csrf = require('./csrf');

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

        beforeSend: function (xhr, settings) {
            if (!csrf.isCsrfExcempt(settings.type) && csrf.isSameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrf.getCookie('csrftoken'));
            }
            if ($.isFunction(options.beforeSend)) options.beforeSend.call(this, xhr, settings);
        },

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
        },
        complete: function (xhr, status) {
            $('[name="csrfmiddlewaretoken"]').val(csrf.getCookie('csrftoken'));
            if ($.isFunction(options.complete)) options.complete.call(this, xhr, status);
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