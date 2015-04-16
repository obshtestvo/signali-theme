$(function () {
    var $html = $('html');
    var currentLangCode = $html.attr('lang')
    var $modelLangSwitch = $(document.getElementById('modelLangSwitchTmpl').text)
    var $modelLangSwitchSelect = $modelLangSwitch.find('select')
    $('.inner-right-column').append($modelLangSwitch)

    var $originalLangPreview = $(document.getElementById('langPreviewTmpl').text)
    var i18nize = function($context) {
        for (languageCode in LANGUAGES) {
            $context.find('[name$="_'+languageCode+'"]').each(function() {
                var $input = $(this);
                var $wrapper = $input.closest('.control-group')
                if (languageCode!=$modelLangSwitchSelect.val()) $wrapper.hide()
                if (languageCode==currentLangCode) return;

                var name = $input.attr('name')
                var currentLangFieldName = name.replace(new RegExp(languageCode + '$'), currentLangCode);
                var $transRef = $originalLangPreview.clone().addClass(currentLangFieldName)
                var $transCollapse = $transRef.find(".collapse")
                $transCollapse.collapse({toggle: false})
                $transRef.find(".toggle").click(function(e) {
                    e.preventDefault();
                    $transCollapse.collapse('toggle')
                })
                $wrapper.find('.controls').append($transRef)
            })
        }
        $context.find('[name$="_' + currentLangCode + '"]').each(function () {
            var $input = $(this);
            var name = $input.attr('name');
            $('.' + name + ' .ref').html($input.val())
            $input.change(function () {
                $('.' + name + ' .ref').html($input.val())
            })
        });
    }

    $('fieldset:visible').each(function() {
        i18nize($(this))
    })

    Suit.after_inline.register('init_i18n', function (inline_prefix, $row) {
        i18nize($row)
    });
    $modelLangSwitchSelect.on('change', function(e) {
        $('[name$="_'+ e.removed.id+'"]').closest('.control-group').hide()
        $('[name$="_'+ e.added.id+'"]').closest('.control-group').show()
    })
});