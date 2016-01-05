import './survey.scss';
import 'service/jquery.animateContentSwitch';
import toggleFixedHeight from 'service/toggleFixedHeight';
import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import scrollTo from 'jquery.scrollto';
import template from './survey.html';

export default class {
    static displayName = 'survey';
    static template = template;
    
    static ready (el) {
        var ratingQuestion = el.querySelector('survey-question[rating]'),
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
                final () {
                    toggleFixedHeight($hiddenSurveyArea, false)
                }
            });
        });

        var validation = new ValidationForm($form);
        var ajaxForm = new AjaxForm($form, {
            pjax: true,
            interactionContainer: $form.closest('[content]'),
            success () {
                scrollTo(el, 300)
            }
        });
        validation.on('form:submit', function() {
            ajaxForm.submit();
            return false;
        });
    }
}