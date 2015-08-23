require('./survey-question.scss')

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
                    $true.attr('fill', 'outlined')
                    $false.attr('fill', 'solid')
                    $input.val(false);
                });
                $true.click(function() {
                    $false.attr('fill', 'outlined')
                    $true.attr('fill', 'solid')
                    $input.val(true);
                });
            }
        }
    })
}