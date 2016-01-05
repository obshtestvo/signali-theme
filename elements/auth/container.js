export class AuthContainerAttribute {
    static type = 'attribute';
    static displayName = 'auth-container';

    static properties = {
        type: {
            attribute: true,
            set (el, data) {
                var $el = $(el);
                if (data.newValue == 'registration') {
                    $el.find('[for="registration"], [for="login"], [not-for]').css("display", "");
                    $el.find('[for="login"], [for="reset"], [not-for="registration"]').hide();
                } else if (data.newValue == 'login') {
                    $el.find('[for="registration"], [for="login"], [not-for]').css("display", "");
                    $el.find('[for="registration"], [for="reset"], [not-for="registration"]').hide();
                } else {
                    $el.find('[for="registration"], [for="reset"], [not-for]').css("display", "");
                    $el.find('[for="registration"], [for="login"], [not-for="reset"]').hide();
                }
                el.auth.type = data.newValue;
            }
        },
        auth: {
            get (el) {
                return el.querySelector('auth');
            }
        }
    };

    setTitle (title) {
        this.querySelector('headline').setTitle(title);
    }

    setSubtitle (html) {
        this.querySelector('headline').setSubtitle(html);
    }

    setInput (name, value) {
        this.auth.setInput(name, value);
    }
}


export class AuthContainerPatchElement {
    static displayName = 'auth-container-patch';

    applyTo (container) {
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