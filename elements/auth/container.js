module.exports = function (componentService) {

    componentService.register('auth-container', {
        type: 'attribute',

        attached: function () {
            if (this.hasBeenAttached) return;
            this.hasBeenAttached = true;
            if (this.tagName != 'MODAL') return;

            var el = this,
                $el = $(el),
                $auth = $(el.auth),
                cancelAuth = function () {
                    el.auth.cancel()
                };

            $el.on('modal:open', function () {
                el.auth.focus()
            });
            $el.on('modal:close', cancelAuth);

            $auth.on('auth:success', function (e, data, ajaxForm) {
                $el.off('modal:close', cancelAuth);
                ajaxForm.setReplaceableElement(el.primary);
            });
            $auth.on('auth:login:success', function () {
                el.close()
            });
        },

        prototype: {
            setTitle: function (title) {
                this.querySelector('headline[for="modal"]').setTitle(title);
            },
            setSubtitle: function (html) {
                this.querySelector('headline[for="modal"]').setSubtitle(html);
            },
            setInput: function (name, value) {
                this.auth.setInput(name, value);
            },
            reset: function () {
                var $this = $(this);
                $this.find('auth-container-patch').remove();
                $this.find('notification[error], notification[success]').hide().find('ul, p').remove();
                $this.find('.error').removeClass('error')
            },
            cloneAuthModal: function(id) {
                if (this.tagName != 'MODAL') throw Error("This auth-container is not a modal");
                var modal = this.cloneModal();
                if (!id) id = "";
                modal.id = id;
                componentService.upgrade(modal);
                modal.reset();
                return modal;
            }
        },

        properties: {
            type: {
                set: function (value) {
                    var $el = $(this);
                    this.auth.type = value;
                    if (value == 'registration') {
                        $el.find('[for="registration"]:hidden').show();
                        $el.find('[for="login"]:visible').hide();
                    } else {
                        $el.find('[for="login"]:hidden').show();
                        $el.find('[for="registration"]:visible').hide();
                    }
                }
            },
            auth: {
                get: function () {
                    return this.querySelector('auth');
                }
            }
        }
    });


    componentService.register('auth-container-patch', {
        prototype: {
            applyTo: function (modal) {
                var $el,
                    $title,
                    $subtitle;

                $el = $(this);
                $title = $el.children('auth-title');
                $subtitle = $el.children('auth-subtitle');
                if ($title.length) modal.setTitle($title.text());
                if ($subtitle.length) modal.setSubtitle($subtitle.html());
            }
        }
    });
};