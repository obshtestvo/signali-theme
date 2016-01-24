import request from 'ajax/request';
import $ from 'jquery';
import EventEmitter from 'eventemitter3';

const urlParser = document.createElement('a');
const fDomain = 'facebook.com';

/**
 * Initiate settings when created
 */
export default class FacebookAuth extends EventEmitter {
    options = null;
    active = false;

    constructor (options) {
        super();
        var defaultOptions = {
            login: this._createLoginHandler(),
            serverGateway: "",
            serverData: {},
            success: $.noop,
            error: $.noop,
            cancel: $.noop,
            scope: []
        };
        this.options = Object.assign(defaultOptions, options)
    }

    /**
     * Loads Facebook SDK and overrides window.open in order to detect blocked popups
     *
     * @param {String} appId sdkCallback app id
     * @param {Function} postSdkCallback  Logic to be executed after the SDK is loaded
     * @param {Function} blockedPopupHandler Logic to handle blocked popup
     */
    static setup(appId, postSdkCallback, blockedPopupHandler) {
        FacebookAuth._overrideWindowOpen(blockedPopupHandler);
        $.ajax({
            dataType: "script",
            cache: true,
            url: '//connect.facebook.net/bg_BG/sdk.js',
            success () {
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
    }

    /**
     * Popup registry and detection of blocked ones
     */
    static popups = [];
    static _overrideWindowOpen (blocked) {
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
    }

    /**
     * Closes all Facebook popups which initiated from the current webpage
     */
    static cancelPrompts = function () {
        FacebookAuth.popups.map(popup => {
            popup.close()
        });
        FacebookAuth.popups = [];
    };

    /**
     * Authenticate user on the server-side
     *
     * @param {String} accessToken
     */
    serverAuth (accessToken) {
        var self = this;
        var serverData = $.extend({}, {"auth_token": accessToken}, self.options.serverData);

        request.json({
            url: self.options.serverGateway,
            method: 'post',
            data: serverData,
            options: {
                success (response, status, xhr) {
                    if (xhr.status == 202) {
                        self.emit('facebook:success', response, true, xhr);
                    } else {
                        self.emit('facebook:success', response, false, xhr);
                    }
                    self.active = false;
                },
                error (error, status, xhr) {
                    self.emit('facebook:fail', error, xhr);
                }
            }
        });
    }

    /**
     * Show Facebook login popup prompt
     *
     * @param {*} * Usual arguments passed to FB.login.
     * This always wraps the callback into another one to destroy events and trigger Cancel?
     */
    loginPrompt () {
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
    getUserDetails (callback) {
        FB.api('/me', function (response) {
            if ($.isFunction(callback)) callback(response)
        });
    }

    /**
     * Handle Facebook API and map it to a more friendly version
     */
    _createLoginHandler () {
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
}