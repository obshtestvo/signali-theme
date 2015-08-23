require('./rating.scss')

module.exports = function (componentService) {
    var name = 'rating';
    if (componentService.has(name)) return;
    componentService.register(name, {
        template: require('./rating.html'),
        created: function() {
            var $el = $(this);
            var $stars = $el.find('star');
            $stars.each(function() {
                var $s = $(this)
                var $hoverStars = $s.prevAll().add($s)
                $s.hover(function(){
                    $hoverStars.addClass('hover')
                }, function(){
                    $hoverStars.removeClass('hover')
                })
            })
        },
        properties: {
            "value": {
                get: function() {
                    var starTypes = [];
                    var rating = parseFloat(this.getAttribute('value'))
                    var afterDecimalPoint = rating % 1;
                    for (var i=1; i<=5;i++) {
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
    })
}