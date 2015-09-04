$(function () {
    Suit.after_inline.register('init_select2', function (inline_prefix, $row) {
        var i = $row.attr('id').replace(inline_prefix + '-', '');
        $row.find('[data-select2-id]').each(function() {
            var $this = $(this)
            var id = $this.attr('id');
            var key = $this.attr('id').replace('-'+i+'-', '_')
            window.django_select2[key](id, $this.data('select2Id'))
        })
    });
});