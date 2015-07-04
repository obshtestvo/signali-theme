require('./settings.scss');

module.exports = function (componentService) {
    componentService.register('settings', {
        created: function() {
            var $el = $(this);
            var $name = $el.find('input[name="name"]');
            $('[settings-trigger]').on('done', function() {
                $name.focus();
            });
        }
    });
};