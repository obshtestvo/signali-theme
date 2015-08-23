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
                var $hoverStars = $s.prevAll().add($s).find('li')
                console.log($hoverStars)
                $s.hover(function(){
                    $hoverStars.addClass('hover')
                }, function(){
                    $hoverStars.removeClass('hover')
                })
            })
        }
    })
}