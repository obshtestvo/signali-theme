import $ from 'jquery';
import Auth from './auth';
import throttle from 'lodash.throttle'
const slice = [].slice;

$(document).on('auth:success', function() {
    var elements = this.querySelector('[auth-required]');
    if (!elements) return;
    slice.call(elements).map(el => el.clearAuthRequirement());
});

var handleForm = function (el) {
    var $form = el.tagName == 'FORM' ? $(el) : $(el.querySelector('form'));
    if ($form.length > 0) el.__handleForm.cancel();
    $form.on('ajax-submit.auth-required submit.auth-required', function (e, originalAjaxForm) {
        e.preventDefault();
        if (!el.authContainer) {
            el.authContainer = Auth.attach(el, el.componentService);
            var $auth = $(el.authContainer).find('auth');
            $auth.on('auth:success', function (e, data) {
                $form.off('.auth-required')
                var authScenario = data.is_new ? 'registration' : 'login';
                $form.append($('<input type="hidden" name="ui_include_auth">').val(authScenario));
                Auth.dismiss(el, function() {
                    $form.submit();
                }, originalAjaxForm)
            });
            $auth.on('auth:registration:success', function (e) {
                e.preventDefault();
            })
        }
        Auth.show(el)
    });
};

export default class AuthRequiredAttribute {
    static displayName = 'auth-required';
    static type = 'attribute';

    static created (el) {
        el.__handleForm =  throttle(handleForm, 50);
    }

    static properties = {
        'auth-required': {
            attribute: true,
            set: function(el, data) {
                el.__handleForm(el, data)
            }
        }
    }

    clearAuthRequirement() {
        var $form = this.tagName == 'FORM' ? $(this) : $(this.querySelector('form'));
        $form.off('.auth-required');
        this.removeAttribute('auth-required')
    }
}