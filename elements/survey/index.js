require('./survey.scss');
require('service/jquery.animateContentSwitch.js');
var toggleFixedHeight = require('service/toggleFixedHeight.js');
var ValidationForm = require('validation/form');
var AjaxForm = require('ajax/form');
var scrollTo = require('jquery.scrollto');

module.exports = function (componentService) {
    componentService.register('survey', {
        template: require('./survey.html'),
        created: function() {
            var el = this,
                ratingQuestion = el.querySelector('survey-question[rating]'),
                $el = $(el),
                $form = $el.find('form'),
                $rating = $el.find('rating'),
                fullSurveyShown = false,
                $hiddenSurveyArea = $('.reveal');
            $rating.on('change', function() {
                if (fullSurveyShown) return;
                fullSurveyShown = true;
                scrollTo(ratingQuestion, 300);
                toggleFixedHeight($hiddenSurveyArea, true);
                $hiddenSurveyArea.animateContentSwitch(null, $hiddenSurveyArea.find('.quick'), {
                    width: false,
                    speed: 300,
                    final: function () {
                        toggleFixedHeight($hiddenSurveyArea, false)
                    }
                });
            });

            var validation = new ValidationForm($form);
            var ajaxForm = new AjaxForm($form, {
                pjax: true,
                interactionContainer: $form.closest('[content]'),
                success: function() {
                    scrollTo(el, 300)
                }
            });
            validation.on('form:submit', function() {
                ajaxForm.submit()
                return false;
            });
        }
    })
};