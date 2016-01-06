import $ from 'jquery';

$(function () {
    Suit.after_inline.register('init_django_selectize', function (inline_prefix, $row) {
        $($row[0]).find('.django-select2').djangoSelect2()
    });
});