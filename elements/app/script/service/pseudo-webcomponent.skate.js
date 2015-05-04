function ComponentService() {
    this.registered = [];
}
ComponentService.prototype.register = function (name, options) {
    if (this.has('name')) throw Error("Component with the same name already exists");
    options = this._transformOptionsForSkate(options)
    var definition = angular.extend({}, ComponentService.componentDefaults, options)
    this.registered.push(name);
    skate(name, definition);
}
ComponentService.prototype.has = function (name) {
    return this.registered.indexOf(name) > -1;
}
ComponentService.prototype._transformOptionsForSkate = function (o) {
    o.template = makeTemplate(o);
}
ComponentService.componentDefaults = {}

function makeTemplate(options) {
    return function (element) {
        var data = {};
        var $el = $(element);
        for (var a = 0; a < element.attributes.length; a++) {
            var attr = element.attributes[a];
            if (attr.name in options.publish) {
                data[attr.name] = attr.value;
            }
        }
        var $template = $(options.template.render(data));
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
    }
}

module.exports = ComponentService;