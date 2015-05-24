$(function() {
    radioTabs(jQuery)
    $('select:visible').each(function() {
        var $select = $(this)
        var placeholder = $select.data('placeholder')
        var options = {}
        if ($select.find('option').length < 7) {
            options['minimumResultsForSearch'] = -1
        }

        if ($select.is('[multiple]')) {
            $select.siblings('.help-inline').addClass('hide')
        } else if (placeholder) {
            options['formatSelection'] =  function (item) {
                return item.text + ' <i class="info">('+placeholder+')</i>';
            }
        }
        $select.select2($.extend({
            //width: $select.width(),
            dropdownAutoWidth: true,
            allowClear: true
        },options))
    })
    $('.select2-chosen').on('mouseenter', function(){
        var $this = $(this);

        if(this.offsetWidth < this.scrollWidth && !$this.attr('title')){
            $this.attr('title', $this.text());
        }
    });
})
// extracted from /admin/js/admin/RelatedObjectLookups.js
// TO BE REMOVED IN 1.8
function dismissAddAnotherPopup(win, newId, newRepr) {
    // newId and newRepr are expected to have previously been escaped by
    // django.utils.html.escape.
    newId = html_unescape(newId);
    newRepr = html_unescape(newRepr);
    var name = windowname_to_id(win.name);
    var elem = document.getElementById(name);
    if (elem) {
        var elemName = elem.nodeName.toUpperCase();
        if (elemName == 'SELECT') {
            var o = new Option(newRepr, newId);
            elem.options[elem.options.length] = o;
            o.selected = true;
            /** START PATCH */
            $(elem).trigger('change')
            /** END PATCH */
        } else if (elemName == 'INPUT') {
            if (elem.className.indexOf('vManyToManyRawIdAdminField') != -1 && elem.value) {
                elem.value += ',' + newId;
            } else {
                elem.value = newId;
            }
        }
    } else {
        var toId = name + "_to";
        elem = document.getElementById(toId);
        var o = new Option(newRepr, newId);
        SelectBox.add_to_cache(toId, o);
        SelectBox.redisplay(toId);
    }
    win.close();
}

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



function radioTabs($) {
    var $tabNavs = $('.radio-tabs');
    $tabNavs.each(function () {
        var $nav = $(this)
        $nav.find('[data-toggle="tab"]').click(function (e) {
            var $trigger = $(this)
            e.preventDefault()
            $trigger.tab('show')
            $trigger.find('input:radio').prop('checked', true)
        })
        $nav.find('input:radio').click(function () {
            var $this = $(this);
            setTimeout(function () {
                $this.prop('checked', true)
            }, 1)
        })
    })
}