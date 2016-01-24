import $ from 'jquery';
import * as csrf from './csrf';

var refreshCsrfHolders = function() {
    $('[name="csrfmiddlewaretoken"]').val(csrf.getCookie('csrftoken'));
};

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

        beforeSend (xhr, settings) {
            if (!csrf.isCsrfExcempt(settings.type) && csrf.isSameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader('X-CSRFToken', csrf.getCookie('csrftoken'));
            }
            if ($.isFunction(options.beforeSend)) options.beforeSend.call(this, xhr, settings);
        },

        success (data, status, xhr) {
            refreshCsrfHolders();
            if (options.determineSuccess(data)) {
                options.success(data, status, xhr)
            } else {
                options.error(data, status, xhr)
            }
        },

        error (xhr, status, err) {
            refreshCsrfHolders();
            var error = err;
            if (xhr.responseText) error = xhr.responseText;
            if (dataType =='json' && xhr.responseJSON) {
                error = xhr.responseJSON;
            }
            options.error(error, status, xhr)
        },
        complete (xhr, status) {
            if ($.isFunction(options.complete)) options.complete.call(this, xhr, status);
        }
    };
    if (data) requestOptions.data = data;
    if (isPjax) requestOptions.headers = {'x-pjax': 1};
    return $.ajax(requestOptions);
};

var shortcuts = {

    execute (url, callback, method, data, dataType, isPjax, options) {
        if ($.isFunction(callback)) {
            options = options || {};
            options.success = callback;
            options.error = callback;
            if (!method) method = 'get';
        }
        return makeRequest(url, method, data, dataType, isPjax, options)
    },

    pjax ({url, callback, method, data, options}) {
        return shortcuts.execute(url, callback, method, data, 'html', true, options)
    },

    json ({url, callback, method, data, options}) {
        return shortcuts.execute(url, callback, method, data, 'json', false, options)
    }
};

export default shortcuts;