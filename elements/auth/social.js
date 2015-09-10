var FacebookAuth = require('./facebook.js');
var Blocker = require('ajax/block');

module.exports = function (componentService) {

    componentService.register('social-auth', {
        created: function () {
            var el = this,
                $auth = $(el).closest('auth'),
                $authContainer = $(el).closest('[auth-container]'),
                facebookAppId = el.getAttribute('facebook-app'),
                facebookScope = JSON.parse(el.getAttribute('facebook-scope')),
                serverGateway = el.getAttribute('server-gateway'),
                $facebookButton = $(el.querySelector('social-button[facebook]'));

            FacebookAuth.setup(facebookAppId);

            el.blocker = new Blocker($authContainer);
            el.facebook = new FacebookAuth({
                scope: facebookScope,
                serverGateway: serverGateway
            });
            el.facebook.on('facebook:success', function(data) {
                $auth.trigger('auth:complete', [data, true])
                el.blocker.unblock()
            });
            el.facebook.on('facebook:cancel', function() {
                el.blocker.unblock()
            });
            el.facebook.on('facebook:fail', function() {
                el.blocker.unblock()
            });

            $facebookButton.on('click', function(e) {
                e.preventDefault();
                el.blocker.block();
                el.facebook.loginPrompt();
            })

        },
        attached: function() {
            if (this.blocker) {
                this.blocker.setElement($(this).closest('[auth-container]'))
            }
        },
    });
};