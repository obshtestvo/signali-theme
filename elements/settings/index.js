require('./settings.scss');

module.exports = function (componentService) {
    componentService.register('settings', {
        template: require('./settings.html'),
        created: function() {
            var $el = $(this);
            var $name = $el.find('input[name="fullname"]');
            $('[settings-trigger]').on('done', function() {
                $name.focus();
            });
        }
    });
};