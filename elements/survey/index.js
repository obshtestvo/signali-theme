require('./survey.scss');
require('service/jquery.animateContentSwitch.js');
var toggleFixedHeight = require('service/toggleFixedHeight.js');

module.exports = function (componentService) {
    componentService.register('survey', {
        template: require('./survey.html'),
        created: function() {
            var $el = $(this);
            var $rating = $el.find('rating');
            var fullSurveyShown = false;
            var $hiddenSurveyArea = $('.reveal');
            console.log($rating)
            $rating.on('change', function() {
                if (fullSurveyShown) return;
                fullSurveyShown = true;
                toggleFixedHeight($hiddenSurveyArea, true);
                $hiddenSurveyArea.animateContentSwitch(null, $hiddenSurveyArea.find('.quick'), {
                    width: false,
                    speed: 300,
                    final: function () {
                        toggleFixedHeight($hiddenSurveyArea, false)
                    }
                });
            })
        }
    })
}