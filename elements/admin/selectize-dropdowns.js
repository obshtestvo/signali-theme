var $ = require('jquery');
require('./auto-width.selectize.js');

$(function () {
    $('select').each(function () {
        var $this = $(this);
        if ($this.closest('.empty-form').length) return;
        var options = {
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
                API.addOption({value: data.item.id, text: data.item.text});
                if (data.selected) API.addItem(data.item.id);
            } else if (data.deleted) {
                API.updateOption(data.item.id);
            } else {
                API.updateOption(data.item.id, {value: data.item.id, text: data.item.text});
            }
        });
        API.on('change', function(e) {
            django.jQuery($this[0]).trigger('change')
        });
    });
});