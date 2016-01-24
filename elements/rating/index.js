import './rating.scss'
import template from './rating.html'
import star from './star.svg'

export default class {
    static displayName = 'rating';
    static template = template;
    static include = {star};

    static ready (el) {

        var $el = $(el),
            readonly = el.hasAttribute('readonly'),
            $stars = $el.find('star'),
            $input = $el.find('input');

        if (readonly) return;

        $stars.each(function () {
            var $s = $(this),
                $hoverStars = $s.prevAll().add($s),
                $nextStars = $s.nextAll();
            $s.hover(function () {
                $hoverStars.addClass('hover')
            }, function () {
                $hoverStars.removeClass('hover')
            });
            $s.click(function () {
                var href = this.getAttribute('href');
                if (href) {
                    window.location.href = href;
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
        stars: {
            get (el) {
                var href = el.getAttribute('href');
                var perStarHref = el.getAttribute('href-type') == 'per-star';
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
                return starTypes.map(function(type, i) {
                    var star = {type};
                    if (href) star.href = href;
                    if (perStarHref) {
                        star.href = star.href + (i+1)
                    }
                    return star;
                });
            }
        },
        value: {
            set: function(el, data) {
                if (!data.newValue) return;
                $(el).find('star').eq(data.newValue-1).click();
            }
        }
    };
}