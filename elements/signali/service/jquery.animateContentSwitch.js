/**
 *
 * Animates the dimensional changes resulting from altering element contents
 *
 */
import $ from 'jquery';
import deepmerge from 'deepmerge';

var overrideTransitions = function(el, properties, animationTime) {
    var variations = [
        'WebkitTransition',
        'msTransition',
        'MozTransition',
        'OTransition',
        'transition'
    ];
    var initialValues = {};
    var value = '', i;
    for (i = 0; i < properties.length; i++) {
        value += properties[i]+ ' '+ animationTime+'ms';
    }
    for (i = 0; i < variations.length; i++) {
        initialValues[variations[i]] = el.style[variations[i]];
        el.style[variations[i]] = value;
    }
    return initialValues;
};

var resetTransitions = function(el, initialValues) {
    for (var transitionVariation in initialValues) {
        if (!initialValues.hasOwnProperty(transitionVariation)) continue;
        el.style[transitionVariation] = initialValues[transitionVariation];
    }
};

$.fn.animateContentSwitch = function (toHide, $toShow, o) {
    return this.each(function () {
        var $this = $(this),
            unfinishedPreviousAnimation = $this.data('animateContentSwitch.previous'),
            originalHeight,
            originalWidth,
            toShowDfd = $.Deferred(),
            heightDfd = $.Deferred(),
            options = deepmerge({
                beforeShow: undefined,
                width: true,
                parallel: false,
                height: true
            }, o || {}),
            targetHeight = null,
            targetWidth = null;

        toHide = toHide ? toHide : $();
        var $toHide = $.type(toHide) == 'string' ? $this.find(toHide) : toHide;
        if ($toHide.length > 1) {
            throw "jQuery.animateContentSwitch accepts only single elements";
        }
        //stop any currently running animations
        $this.dequeue().stop();
        originalHeight = $this.outerHeight();
        originalWidth = $this.outerWidth();
        if ($toHide.length) $toHide.dequeue().stop();
        $toShow.dequeue().stop();

        // check if there was a previous animation by animateContent
        // if the current toHide element is the same as the visible element
        // from the previous animation then continue, otherwise
        // jump to the end of the previous animation
        if ($.type(unfinishedPreviousAnimation) != 'undefined') {
            var prevToHide = unfinishedPreviousAnimation.start.el;
            if ($.type(prevToHide) == 'string') {
                prevToHide = $this.find(prevToHide);
            }
            var visibleStep = prevToHide.is(':visible') ? unfinishedPreviousAnimation.start : unfinishedPreviousAnimation.target;
            var prevVisibleEl = $.type(visibleStep.el) == 'string' ? $this.find(visibleStep.el) : visibleStep.el;
            prevVisibleEl.dequeue().stop();
            // check if the visible element from previous animation is not the element that
            // has to be hidden from this current animation
            if (
                !(
                    ($.type(toHide) == 'string' && prevVisibleEl.is(toHide)) ||
                    ($.type(toHide) != 'string' && prevVisibleEl.get(0) == toHide.get(0))
                )
            ) {
                $this.css('height', unfinishedPreviousAnimation.target.height);
                unfinishedPreviousAnimation.start.el.dequeue().stop().hide();
                unfinishedPreviousAnimation.target.el.dequeue().stop().show();
            } else {
                originalHeight = visibleStep.height;
                originalWidth = visibleStep.width;
            }
        }
        targetHeight = originalHeight - (($toHide.length ? $toHide.outerHeight(true) : 0) - $toShow.outerHeight(true));
        targetWidth = originalWidth - (($toHide.length ? $toHide.outerWidth(true) : 0) - $toShow.outerWidth(true));
        //save current animation data
        var data = {
            start: {
                height: originalHeight,
                width: originalWidth,
                el: toHide
            },
            target: {
                height: targetHeight,
                width: targetWidth,
                el: $toShow
            }
        };
        $this.data('animateContentSwitch.animating', data);
        var hide = function () {
            var originalTransitions = overrideTransitions($toHide[0], ['opacity'], options.speed);
            $toHide.css('opacity', 0);
            setTimeout(function() {
                resetTransitions($toHide[0], originalTransitions);
                if ($.isFunction(options.beforeShow)) {
                    if (!options.parallel) options.beforeShow(show);
                } else {
                    if (!options.parallel) show();
                }
                $toHide.hide();
            }, options.speed);
        };

        var show = function () {
            // Using Deferred objects for a `group` callback

            var delay = Math.floor(options.speed*0.1);
            $toShow.css('opacity', 0);
            $toShow.show();
            var originalTransitions = overrideTransitions($toShow[0], ['opacity'], options.speed);

            setTimeout(function(){
                $toShow.css('opacity', 1);
            }, delay);

            setTimeout(function() {
                resetTransitions($toShow[0], originalTransitions);
                toShowDfd.resolve()
            }, options.speed+delay);
        };


        var adjustHeight = function() {

            var targetAnimation = {
                height: targetHeight,
                width: targetWidth
            };
            if (!options.width) delete targetAnimation.width;
            if (!options.height) delete targetAnimation.height;

            var originalTransitions = overrideTransitions($this[0], Object.keys(targetAnimation), options.speed);
            $this.css(targetAnimation);

            setTimeout(function() {
                resetTransitions($this[0], originalTransitions);
                heightDfd.resolve()
            }, options.speed);
        };


        if ($toHide.length) hide();

        setTimeout(function() {
            adjustHeight();
        }, Math.floor(options.speed*0.3));

        if (options.parallel || !$toHide.length ) {
            if ($.isFunction(options.beforeShow)) {
                options.beforeShow(show);
            } else {
                show();
            }
        }

        $.when(toShowDfd, heightDfd).then(function ()
        {
            $this.removeData('animateContentSwitch.previous');
            if ($.isFunction(options.final)) {
                options.final();
            }
        });
    });
};