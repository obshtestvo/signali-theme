import './rating.scss'
import template from './rating.html'
import star from './star.svg'

export default class {
    static displayName = 'rating';
    static template = template;
    static include = {star};

    static ready (el) {
        var $el = $(el),
            $stars = $el.find('star'),
            $input = $el.find('input');
        $stars.each(function () {
            var $s = $(this);
            var $hoverStars = $s.prevAll().add($s);
            var $nextStars = $s.nextAll();
            $s.hover(function () {
                $hoverStars.addClass('hover')
            }, function () {
                $hoverStars.removeClass('hover')
            });
            $s.click(function () {
                if (el.hasAttribute('href')) {
                    window.location.href = el.getAttribute('href');
                    return;
                }
                $stars.attr('type', 'empty');
                $nextStars.removeClass('user');
                $hoverStars.addClass('user');
                $input.val($s.index() + 1);
                $el.trigger('change');
            })
        })
    }

    static properties = {
        "star-types": {
            get (el) {
                var starTypes = [];
                var rating = parseFloat(el.getAttribute('value'));
                var afterDecimalPoint = rating % 1;
                for (let i = 1; i <= 5; i++) {
                    if (i <= rating) {
                        starTypes.push('full');
                        continue;
                    }
                    if (afterDecimalPoint) {
                        if (afterDecimalPoint > 0.6) {
                            starTypes.push('full');
                        } else if (afterDecimalPoint > 0.35) {
                            starTypes.push('half');
                        }
                        afterDecimalPoint = false;
                        continue;
                    }
                    starTypes.push('empty');
                }
                return starTypes
            }
        }
    }
}