require('./survey.scss');
require('service/jquery.animateContentSwitch.js');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');

module.exports = function (componentService) {
    componentService.register('survey', {
        template: require('./survey.html'),
        created: function() {
            var el = this;
            var $el = $(el);
            var $form = $el.find('form');
            var $rating = $el.find('rating');
            var fullSurveyShown = false;
            var $hiddenSurveyArea = $('.reveal');
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
            });

            var validation = new ValidationForm($form, {
                markSuccess: false
            });
            var ajaxForm = new AjaxForm($form, {
                pjax: true,
                containerAscendantSelector: '[content]'
            });
            validation.on('form:submit', function() {
                ajaxForm.getSubmitHandler()
                return false;
            });
        }
    })
};