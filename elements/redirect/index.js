var $ = require('jquery');
var Circle = require('progressbar.js/src/circle');
require('./redirect.scss');

module.exports = function (componentService) {
    componentService.register('redirect', {
        template: require('./redirect.html'),
        created: function() {
            var el = this;
            var $this = $(el);
            var $modal = $this.closest('modal');
            var time = this.getAttribute('time');
            var $pauseTrigger = $(this.querySelector('.pause'));
            var $playTrigger = $(this.querySelector('.play'));
            if (!time) time = 5000;

            this.time = parseInt(time);
            this.location = this.getAttribute('location');
            this.progress = new Circle(this.querySelector('.countdown'), {
                color: 'PROGRESSPATH',
                trailColor: 'TRAILPATH',
                strokeWidth: 4,
                duration: time,
                step: function(state, bar) {
                    bar.setText(Math.ceil((1-bar.value()) * 5))
                }
            });

            $modal.on('modal:open', function() {
                el.play()
            });

            $modal.on('modal:close', function() {
                el.reset()
            });

            $pauseTrigger.on('click', function() {
                el.pause()
            });

            $playTrigger.on('click', function() {
                el.play()
            })
        },
        prototype: {
            play: function(timeRemaining) {
                var el = this;
                if (!timeRemaining) {
                    timeRemaining = Math.round((1-el.progress.value()) * el.time);
                }
                this.querySelector('.countdown').removeAttribute('paused')
                el.progress.animate(1, {
                    duration: timeRemaining,
                });
                clearTimeout(this.timeout);
                el.timeout = setTimeout(function() {
                    window.location.href = el.location;
                }, timeRemaining)
            },
            pause: function() {
                clearTimeout(this.timeout);
                this.progress.stop();
                this.querySelector('.countdown').setAttribute('paused','')
            },
            reset: function() {
                this.progress.stop();
                this.progress.set(0);
                clearTimeout(this.timeout);
                this.querySelector('.countdown').removeAttribute('paused')
            },
            completeIn: function(time) {
                this.play(time)
            }
        }
    })
};
