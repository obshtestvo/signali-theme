require('animate.css/source/_base.css');
require('animate.css/source/flippers/flipInX.css');
require('animate.css/source/fading_exits/fadeOut.css');
require('animate.css/source/fading_entrances/fadeInUp.css');
require('./bubble.scss');

module.exports = function (componentService) {
    var container = document.createElement('div');
    var $container = $(container)
    container.setAttribute('bubble-container', '');
    document.getElementsByTagName('body')[0].appendChild(container);

    componentService.register('bubble', {
        template: require('./bubble.html'),
        include: {
            iconCheck: require('./check-circle.svg'),
            iconExclamation: require('./exclamation-circle.svg'),
            iconInfo: require('./info-circle.svg'),
            iconClose: require('./close.svg')
        },
        created: function() {
            this.showClass = 'fadeInUp';
            this.hideClass = 'fadeOut';
            this.animationDuration = 700;
            this.showDuration = 2400;
            var $this = $(this);

            $this.click(function() {
                this.hide()
            })
            $this.hover(function() {
                $this.removeClass(this.hideClass);
                clearTimeout(this.timeout);
                console.log('clearTimeout')
            }, function() {
                this.autoclose()
            });
            $(document).on("mfpOpen", function() {
                $container.css('right', $('html').css('margin-right'))
            });
            $(document).on("mfpClose", function() {
                $container.css('right', 0)
            })
        },
        properties: {
            "information": {
                get: function () {
                    return this.getAttribute('type')=='information'
                }
            },
            "success": {
                get: function () {
                    return this.getAttribute('type') == 'success'
                }
            },
            "error": {
                get: function () {
                    return this.getAttribute('type')=='error'
                }
            }
        },
        prototype: {
            autoclose: function() {
                var self = this;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function() {
                    self.hide();
                }, this.showDuration)
            },
            show: function () {
                this.autoclose();
                document.querySelector('[bubble-container]').appendChild(this);
                $(this).show()
            },
            hide: function () {
                var $this = $(this)
                $this.removeClass(this.showClass);
                $this.addClass(this.hideClass);
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function() {
                    $this.remove()
                }, this.animationDuration)
            }
        }
    })
};