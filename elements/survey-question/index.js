require('./survey-question.scss');

module.exports = function (componentService) {
    componentService.register('survey-question', {
        template: require('./survey-question.html'),
        created: function() {
            if (this.hasAttribute('checkbox')) {
                var $el = $(this);
                var $input = $el.find('input');
                var $true = $el.find('[true]');
                var $false = $el.find('[false]');
                $false.click(function() {
                    $true.attr('fill', 'outlined');
                    $false.attr('fill', 'solid');
                    $input.prop( "checked", false ).change()
                });
                $true.click(function() {
                    $false.attr('fill', 'outlined');
                    $true.attr('fill', 'solid');
                    $input.prop( "checked", true).change()
                });
            }
        },
        properties: {
            "value": {
                get: function() {
                    var el = this;
                    if (el.hasAttribute('checkbox')) {
                        if (el.querySelector('[fill=solid]')) {
                            return el.querySelector('input').checked;
                        } else {
                            return undefined;
                        }
                    }
                    if (el.hasAttribute('rating')) {
                        var rating = $(el.querySelector('rating input')).val()
                        if (rating == '0') return undefined;
                        return rating;
                    }
                }
            },
            "validate-trigger": {
                get: function() {
                    return 'change'
                }
            }
        }
    })
};