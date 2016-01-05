import FacebookAuth from './facebook';
import Blocker from 'ajax/block';

var hasOtherElements = false;

export default class {
    static displayName = 'social-auth';

    static ready (el) {
        var $auth = $(el).closest('auth'),
            $authContainer = $(el).closest('[auth-container]'),
            facebookAppId = el.getAttribute('facebook-app'),
            facebookScope = JSON.parse(el.getAttribute('facebook-scope')),
            serverGateway = el.getAttribute('server-gateway'),
            $facebookButton = $(el.querySelector('social-button[facebook]'));

        if (!hasOtherElements) {
            FacebookAuth.setup(facebookAppId);
            hasOtherElements = true;
        }

        el.blocker = new Blocker($authContainer);
        el.facebook = new FacebookAuth({
            scope: facebookScope,
            serverGateway: serverGateway
        });
        el.facebook.on('facebook:success', function (data) {
            $auth.trigger('auth:complete', [data, true])
            el.blocker.unblock()
        });
        el.facebook.on('facebook:cancel', function () {
            el.blocker.unblock()
        });
        el.facebook.on('facebook:fail', function () {
            el.blocker.unblock()
        });

        $facebookButton.on('click', function (e) {
            e.preventDefault();
            el.blocker.block();
            el.facebook.loginPrompt();
        })

    }

    static attached (el) {
        if (el.blocker) {
            el.blocker.setElement($(el).closest('[auth-container]'))
        }
    }
}