$ = require('jquery');

var adaptor;

module.exports = function (componentService, adaptors) {
    adaptor = adaptors[0];

    componentService.register('auth-required', {
        type: 'attribute',
        created: function () {
            var el = this,
                $form = el.tagName == 'FORM' ? $(el) : $(el.querySelector('form'));

            $form.on('ajax-submit.auth-required submit.auth-required', function (e, originalAjaxForm) {
                e.preventDefault();
                if (!el.authContainer) {
                    el.authContainer = adaptor.attach(el, componentService);
                    var $auth = $(el.authContainer).find('auth');
                    $auth.on('auth:success', function (e, data) {
                        $form.off('.auth-required')
                        var authScenario = data.is_new ? 'registration' : 'login';
                        $form.append($('<input type="hidden" name="ui_include_auth">').val(authScenario));
                        adaptor.dismiss(el, function() {
                            $form.submit();
                        }, originalAjaxForm)
                    });
                    $auth.on('auth:registration:success', function (e) {
                        e.preventDefault();
                    })
                }
                adaptor.show(el)
            });
            $(document).on('auth:success', function() {
                var elements = this.querySelector('[auth-required]');
                if (!elements) return;
                elements.clearAuthRequirement();
            })
        },

        prototype: {
            clearAuthRequirement: function() {
                var $form = this.tagName == 'FORM' ? $(this) : $(this.querySelector('form'));
                $form.off('.auth-required');
                this.removeAttribute('auth-required')
            }
        }
    });
};