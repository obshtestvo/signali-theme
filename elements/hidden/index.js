module.exports = function (componentService) {
    componentService.register('hidden', {
        type: 'attribute',
        created: function() {
            var $el = $(this);
            $el.prop('hidden', false);
            $el.removeAttr('hidden');
            $el.hide();
        }
    })
};