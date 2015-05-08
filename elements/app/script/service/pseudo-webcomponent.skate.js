var skate = require('skatejs');
var $ = require('jquery');

function ComponentService() {
    this.registered = [];
}
ComponentService.prototype.register = function (name, options) {
    if (this.has('name')) throw Error("Component with the same name already exists");
    options = this._transformOptionsForSkate(options)
    var definition = $.extend({}, ComponentService.componentDefaults, options)
    this.registered.push(name);
    skate(name, definition);
}
ComponentService.prototype.has = function (name) {
    return this.registered.indexOf(name) > -1;
}
ComponentService.prototype._transformOptionsForSkate = function (o) {
    if (o.template) {
        o = $.extend({}, o, {
            template: makeTemplate(o)
        });
    }
    return o
}
ComponentService.componentDefaults = {
    publish: []
}

function makeTemplate(options) {
    return function (element) {
        var data = {};
        var $el = $(element);
        for (var a = 0; a < element.attributes.length; a++) {
            var attr = element.attributes[a];
            data[attr.name] = attr.value;
        }
        var $template = $(options.template(data));
        if (options.type == skate.type.ATTRIBUTE) {
            $el.after($template);
            var $placeholder = $template.find('content');
            $placeholder.after($el);
            $placeholder.remove()
            return;
        }
        var $content = $el.contents();
        $template.find('content[select]').each(function () {
            var $placeholder = $(this);
            var filter = $placeholder.attr('select');
            $placeholder.after($content.filter(filter));
            $placeholder.remove();
            $content = $content.not(filter)
        });
        $template.find('content').each(function () {
            var $placeholder = $(this);
            $placeholder.after($content);
            $placeholder.remove();
        });
        $el.append($template)
    }
}

module.exports = ComponentService;