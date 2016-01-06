import $ from 'jquery';
import './auto-width.selectize.js';

$(function () {
    $('select').each(function () {
        var $this = $(this);
        if ($this.closest('.empty-form').length) return;
        var options = {
            valueField: 'id',
            labelField: 'text',
            plugins: ['autowidth'],
            render: {}
        };
        var placeholder = $this.data('placeholder');

        if ($this.is('[multiple]')) {
            options.plugins.push('remove_button')
            $this.closest('.controls').find('.help-inline').addClass('hide')
        } else if (placeholder) {
            var suffx = placeholder ? ' <i class="info">('+placeholder+')</i>' : '';
            options.render.item = function (item, escape) {
                return '<div class="item">' + escape(item.text) + suffx + '</div>';
            }
        }

        if ($this.is('.django-select2')) {
            options = {}
            if ($this.closest('.inline-related').length) {
                options.preload = false;
            }
            var API = $this.djangoSelect2(options)[0].selectize;
        } else {
            var API = $this.selectize(options)[0].selectize;
        }

        $this.change(function(e, data){
            if (!data) return;
            if (data.isNew) {
                API.addOption(data.item);
                if (data.selected) API.addItem(data.item.id);
            } else if (data.deleted) {
                API.removeOption(data.item.id);
            } else {
                API.updateOption(data.item.id, data.item);
            }
        });
        API.on('change', function(e) {
           if (API.getValue()) {
               API.$input.find('option').attr('data-name', API.revertSettings.$children.filter('[value]').data('name'))
           }
            django.jQuery($this[0]).trigger('change')
            Suit.$($this[0]).trigger('change')
        });
    });
});