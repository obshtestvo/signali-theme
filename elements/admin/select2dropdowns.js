$(function() {
    $('select:visible').each(function() {
        var $select = $(this);
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
            dropdownAutoWidth: true,
            allowClear: true
        },options))
    });


    $('.select2-chosen').on('mouseenter', function(){
        var $this = $(this);

        if(this.offsetWidth < this.scrollWidth && !$this.attr('title')){
            $this.attr('title', $this.text());
        }
    });
});