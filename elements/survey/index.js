import './survey.scss';
import 'service/jquery.animateContentSwitch';
import toggleFixedHeight from 'service/toggleFixedHeight';
import ValidationForm from 'validation/form';
import AjaxForm from 'ajax/form';
import scrollTo from 'jquery.scrollto';
import template from './survey.html';
import $ from 'jquery';

export default class {
    static displayName = 'survey';
    static template = template;

    static ready(el) {
        var $el = $(el),
            $form = $el.find('form'),
            $rating = $el.find('rating'),
            fullSurveyShown = false,
            hashPrefix = `#${el.id}_rating_`,
            $hiddenSurveyArea = $('.reveal'),
            hashChange = false;

        var handleHash = function () {
            var hash = window.location.hash;
            if (hash.indexOf(hashPrefix) !== 0) return;
            hashChange = true;
            window.history.replaceState( {} , 'preventAccidentalRatingLink', '#' );
            var hashTokens = hash.split('_');
            var rating = hashTokens[hashTokens.length-1];
            $rating[0].value = parseInt(rating);
        };

        $rating.on('change', function () {
            if (fullSurveyShown) return;
            fullSurveyShown = true;
            if (hashChange) {
                $hiddenSurveyArea.find('.quick').removeAttr('hidden').show();
                return
            }
            scrollTo(el, 300);
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
        validation.on('form:submit', function () {
            ajaxForm.submit();
            return false;
        });
        window.addEventListener("hashchange", handleHash, false);
        handleHash()
    }
}