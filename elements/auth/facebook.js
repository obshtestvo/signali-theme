var request = require('ajax/request');
var $ = require('jquery');
var EventEmitter = require('eventemitter3');

var urlParser = document.createElement('a');
var fDomain = 'facebook.com';

/**
 * Initiate settings when created
 */
var FacebookAuth = function (options) {
    EventEmitter.call(this);
    var defaultOptions = {
        login: this._createLoginHandler(),
        serverGateway: "",
        serverData: {},
        success: $.noop,
        error: $.noop,
        cancel: $.noop,
        scope: []
    };
    this.options = $.extend(defaultOptions, options)
};
FacebookAuth.prototype = Object.create(EventEmitter.prototype);
FacebookAuth.prototype.constructor = FacebookAuth;
FacebookAuth.prototype.options = null;
FacebookAuth.prototype.active = false;


/**
 * Loads Facebook SDK and overrides window.open in order to detect blocked popups
 *
 * @param {String} appId sdkCallback app id
 * @param {Function} postSdkCallback  Logic to be executed after the SDK is loaded
 * @param {Function} blockedPopupHandler Logic to handle blocked popup
 */
FacebookAuth.setup = function (appId, postSdkCallback, blockedPopupHandler) {
    FacebookAuth._overrideWindowOpen(blockedPopupHandler);
    $.ajax({
        dataType: "script",
        cache: true,
        url: '//connect.facebook.net/bg_BG/sdk.js',
        success: function() {
            FB.init({
                version: 'v2.0',
                appId: appId,
                xfbml: false, // parse xfbml
                status: false, // check login status
                cookie: true // enable cookies to allow the server to access the session
            });

            if ($.isFunction(postSdkCallback)) postSdkCallback()
        }
    });
};

/**
 * Popup registry and detection of blocked ones
 */
FacebookAuth.popups = [];
FacebookAuth._overrideWindowOpen = function (blocked) {
    var originalWindowOpen = window.open;
    window.open = function (url) {
        var popup = originalWindowOpen.apply(this, arguments);
        urlParser.href = url;
        var domain = urlParser.hostname;
        if (domain.indexOf(fDomain) !== -1 && $.inArray(popup, FacebookAuth.popups) === -1) {
            if (popup == null || typeof popup == 'undefined') {
                blocked()
            } else {
                FacebookAuth.popups.push(popup);
            }
        }
        return popup
    }
};

/**
 * Closes all Facebook popups which initiated from the current webpage
 */
FacebookAuth.cancelPrompts = function () {
    for (var i = 0; i < FacebookAuth.popups.length; i++) {
        FacebookAuth.popups[i].close()
    }
    FacebookAuth.popups = []
};


/**
 * Authenticate user on the server-side
 *
 * @param {String} accessToken
 */
FacebookAuth.prototype.serverAuth = function (accessToken) {
    var self = this;
    var serverData = $.extend({}, {"auth_token": accessToken}, self.options.serverData);

    request.json(
        self.options.serverGateway,
        'post',
        serverData,
        {
            success: function (response, status, xhr) {
                if (xhr.status == 202) {
                    self.emit('facebook:success', response, true, xhr);
                } else {
                    self.emit('facebook:success', response, false, xhr);
                }
                self.active = false;
            },
            error: function (error, status, xhr) {
                self.emit('facebook:fail', error, xhr);
            }
        }
    );
}



/**
 * Show Facebook login popup prompt
 *
 * @param {*} * Usual arguments passed to FB.login.
 * This always wraps the callback into another one to destroy events and trigger Cancel?
 */
FacebookAuth.prototype.loginPrompt = function () {
    var self = this;
    FB.Event.subscribe('auth.authResponseChange', self.options.login);
    var args = Array.prototype.slice.call(arguments);
    var originalCallback = args[0];
    args[0] = function () {
        FB.Event.unsubscribe('auth.authResponseChange', self.options.login);
        if (!self.active)  self.options.cancel();
        if ($.isFunction(originalCallback)) originalCallback()
    };
    args[1] = $.extend({}, {
        scope: self.options.scope
    });
    return FB.login.apply(FB, args);
}


/**
 * Retrieve user details from facebook
 *
 * @param {Function} callback Logic to be executed after the details are retrieved
 */
FacebookAuth.prototype.getUserDetails = function (callback) {
    FB.api('/me', function (response) {
        if ($.isFunction(callback)) callback(response)
    });
}



/**
 * Handle Facebook API and map it to a more friendly version
 */
FacebookAuth.prototype._createLoginHandler = function () {
    var self = this;
    return function (response) {
        self.active = true;
        if (response.status === 'connected') {
            // user logged in facebook and authorized app
            self.serverAuth(response.authResponse.accessToken)
        } else if (response.status === 'not_authorized') {
            // user logged in facebook but haven't authorized app
            self.emit('facebook:cancel', response);
            self.active = false;
        } else {
            // user not logged in facebook
            self.emit('facebook:unavailable', response);
            self.active = false;
        }
    }
}

module.exports = FacebookAuth;