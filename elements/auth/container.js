module.exports = function (componentService) {

    componentService.register('auth-container', {
        type: 'attribute',
        created: function () {
            this.type = this.auth.type
        },

        prototype: {
            setTitle: function (title) {
                this.querySelector('headline').setTitle(title);
            },
            setSubtitle: function (html) {
                this.querySelector('headline').setSubtitle(html);
            },
            setInput: function (name, value) {
                this.auth.setInput(name, value);
            },
            reset: function () {
                var $this = $(this);
                $this.find('auth-container-patch').remove();
                $this.find('notification[error], notification[success]').hide().find('ul, p').remove();
                $this.find('.error').removeClass('error')
            }
        },

        properties: {
            type: {
                set: function (value) {
                    var $el = $(this);
                    if (value == 'registration') {
                        $el.find('[for="registration"], [not-for]').show();
                        $el.find('[for="login"], [for="reset"], [not-for="registration"]').hide();
                    } else if (value == 'login') {
                        $el.find('[for="login"], [not-for]').show();
                        $el.find('[for="registration"], [for="reset"], [not-for="registration"]').hide();
                    } else {
                        $el.find('[for="reset"], [not-for]').show();
                        $el.find('[for="registration"], [for="login"], [not-for="reset"]').hide();
                    }
                    this.auth.type = value;
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
            applyTo: function (container) {
                var $el,
                    $title,
                    $subtitle;

                $el = $(this);
                $title = $el.children('auth-title');
                $subtitle = $el.children('auth-subtitle');
                if ($title.length) container.setTitle($title.text());
                if ($subtitle.length) container.setSubtitle($subtitle.html());
            }
        }
    });
};