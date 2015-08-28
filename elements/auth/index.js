$ = require('jquery');
require('ajax');
require('./auth.scss');

module.exports = function (componentService) {

    componentService.register('auth', {
        template: require('./auth.html'),
        properties: {
            type: {
                attr: true,
                set: function(value) {
                    var $el = $(this);
                    if (value == 'registration') {
                        $el.find('[for="registration"]').show();
                        $el.find('[for="login"]').hide();
                        $el.find('input[name="name"]').focus();
                    } else {
                        $el.find('[for="login"]').show();
                        $el.find('[for="registration"]').hide();
                        $el.find('input[name="email"]').focus();
                    }
                }
            }
        },
        prototype: {
            setInput: function (name, value) {
                var $el = $(this);
                var $input = $el.find('input[name="'+name+'"]');
                if (!$input.length) {
                    $el.find('form').append('<input type="hidden" name="'+name+'">');
                }
                $input.val(value);
            }
        }
    });


    componentService.register('auth-modal', {
        type: 'attribute',
        prototype: {
            setTitle: function (title) {
                this.querySelector('headline[for="modal"]').setTitle(title);
            },
            setSubtitle: function (html) {
                this.querySelector('headline[for="modal"]').setSubtitle(html);
            },
            setInput: function (name, value) {
                this.querySelector('auth').setInput(name, value);
            }
        },
        properties: {
            type: {
                set: function(value) {
                    var $el = $(this);
                    this.querySelector('auth').type = value;
                    if (value == 'registration') {
                        $el.find('[for="registration"]:hidden').show();
                        $el.find('[for="login"]:visible').hide();
                    } else {
                        $el.find('[for="login"]:hidden').show();
                        $el.find('[for="registration"]:visible').hide();
                    }
                }
            }
        }
    });


    componentService.register('auth-trigger', {
        type: 'attribute',
        created: function () {
            var $trigger = $(this);
            var $authModal = $($trigger.attr('href'));
            var authModal = $authModal[0];
            var $email = $authModal.find('input[name="email"]');
            var $name = $authModal.find('input[name="name"]');
            var isRegistration = $trigger.attr('type') == 'registration';
            var registrationPatch = authModal.querySelector('auth-modal-patch[for="registration"]');
            var loginPatch = authModal.querySelector('auth-modal-patch[for="login"]');

            $trigger.click(function () {
                if (isRegistration) {
                    registrationPatch.applyTo(authModal);
                    authModal.type = 'registration';
                } else {
                    loginPatch.applyTo(authModal);
                    authModal.type = 'login';
                }
            });

            if ($trigger.attr('target')=='modal') {
                $trigger.on('done', function () {
                    if (isRegistration) {
                        $name.focus();
                    } else {
                        $email.focus();
                    }
                });
            }
        }
    });


    componentService.register('auth-required', {
        type: 'attribute',
        created: function () {
            var $el, $form, $modalPatch;
            $el = $(this);
            $modalPatch = $el.find('auth-modal-patch');

            if (this.tagName == 'FORM') {
                $form = $el
            } else {
                $form = $el.find('form').eq(0)
            }

            $form.on('ajax-submit', function (e) {
                e.preventDefault();
            });

            $form.on('submit', function (e) {
                e.preventDefault();
                var modal = $('#generic-auth')[0].cloneNode(true);
                modal.id = 'commentAuth';
                componentService.upgrade(modal);
                $modalPatch[0].applyTo(modal);
                modal.show();
            });
        }
    });


    componentService.register('auth-modal-patch', {
        prototype: {
            applyTo: function (modal) {
                var $el,
                    $title,
                    $subtitle,
                    submission;

                $el = $(this);
                $title = $el.children('auth-title');
                $subtitle = $el.children('auth-subtitle');
                submission = this.getAttribute('submission');
                if ($title.length) modal.setTitle($title.text());
                if ($subtitle.length) modal.setSubtitle($subtitle.html());
                if (submission) modal.setInput('submission', submission);
            }
        }
    });

};