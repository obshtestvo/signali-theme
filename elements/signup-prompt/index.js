var $ = require('jquery');
var Circle = require('progressbar.js/src/circle');
require('./signup-prompt.scss');

module.exports = function (componentService) {
    componentService.register('signup-prompt', {
        template: require('./signup-prompt.html'),
        created: function() {
            var $this = $(this);
            var $modal = $this.closest('modal');
            var $form = $this.find('form');
            var timeout;
            var time = 5000;
            var progress = new Circle(this.querySelector('.countdown'), {
                color: 'PROGRESSPATH',
                trailColor: 'TRAILPATH',
                strokeWidth: 4,
                duration: time,
                step: function(state, bar) {
                    bar.setText(Math.ceil((1-bar.value()) * 5))
                }
            });

            $modal.on('modal:open', function() {
                progress.animate(1);
                timeout = setTimeout(function() {
                    window.location = "http://local.signali.bg/contact-points/natsionalen_ombudsman/";
                }, time)
            });

            $modal.on('modal:close', function() {
                progress.stop()
                progress.set(0)
                clearTimeout(timeout)
            });

            $form.find('input').on('focus keyup', function() {
                clearTimeout(timeout)
                progress.stop()
            });
        }
    })
};
