import $ from 'jquery'
import Circle from 'progressbar.js/src/circle'
import template from './redirect.html'
import './redirect.scss'

export default class {
    static displayName = 'redirect';
    static template = template;

    static ready (el) {
        var $this = $(el),
            $modal = $this.closest('modal'),
            time = el.getAttribute('time'),
            $pauseTrigger = $(el.querySelector('.pause')),
            $playTrigger = $(el.querySelector('.play'));
        if (!time) time = 5000;

        el.time = parseInt(time);
        el.location = el.getAttribute('location');
        el.progress = new Circle(el.querySelector('.countdown'), {
            color: 'PROGRESSPATH',
            trailColor: 'TRAILPATH',
            strokeWidth: 4,
            duration: time,
            step (state, bar) {
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
    }

    play (timeRemaining) {
        var el = this;
        if (!timeRemaining) {
            timeRemaining = Math.round((1-el.progress.value()) * el.time);
        }
        this.querySelector('.countdown').removeAttribute('paused');
        el.progress.animate(1, {
            duration: timeRemaining
        });
        clearTimeout(this.timeout);
        el.timeout = setTimeout(function() {
            window.location.href = el.location;
        }, timeRemaining)
    }

    pause () {
        clearTimeout(this.timeout);
        this.progress.stop();
        this.querySelector('.countdown').setAttribute('paused','')
    }

    reset () {
        this.progress.stop();
        this.progress.set(0);
        clearTimeout(this.timeout);
        this.querySelector('.countdown').removeAttribute('paused')
    }

    completeIn (time) {
        this.play(time)
    }
}