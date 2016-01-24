import './survey-question.scss';
import template from './survey-question.html';
import $ from 'jquery';

export default class {
    static displayName = 'survey-question';
    static template = template;

    static ready (el) {
        if (el.hasAttribute('checkbox')) {
            var $el = $(el);
            var $input = $el.find('input');
            var $true = $el.find('[true]');
            var $false = $el.find('[false]');
            $false.click(function() {
                $true.attr('fill', 'outlined');
                $false.attr('fill', 'solid');
                $input.prop( 'checked', false ).change()
            });
            $true.click(function() {
                $false.attr('fill', 'outlined');
                $true.attr('fill', 'solid');
                $input.prop( 'checked', true).change()
            });
        }
    }

    static properties = {
        'value': {
            get: function(el) {
                if (el.hasAttribute('checkbox')) {
                    if (el.querySelector('[fill=solid]')) {
                        return el.querySelector('input').checked;
                    } else {
                        return undefined;
                    }
                }
                if (el.hasAttribute('rating')) {
                    var rating = $(el.querySelector('rating input')).val();
                    if (rating == '0') return undefined;
                    return rating;
                }
            }
        },
        'validate-trigger': {
            get: function() {
                return 'change'
            }
        }
    };
}