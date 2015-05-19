var skate = require('skatejs');
var $ = require('jquery');

function ComponentService() {
    this.registered = [];
}
ComponentService.prototype.register = function (name, options) {
    if (this.has('name')) throw Error("Component with the same name already exists");
    var definition = {};
    if (options) {
        options = this._transformOptionsForSkate(options)
        definition = $.extend({}, ComponentService.componentDefaults, options)
    }
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
        var data = this.include || {};
        for (var a = 0; a < element.attributes.length; a++) {
            var attr = element.attributes[a];
            data[attr.name] = attr.value == '' ? true : attr.value;
        }
        var $template = $(options.template(data));
        if (options.type == skate.type.ATTRIBUTE) {
            $el.after($template);
            var $placeholder = $template.find('content');
            $placeholder.after($el);
            $placeholder.remove()
            return;
        }
        var el, i, j, k, placeholder, docfrag;
        for (i = 0; i < $template.length; i++) {
            el = $template[i]
            var queriedPlacehoders = el.querySelectorAll('content[select]')
            for (j = 0; j < queriedPlacehoders.length; j++) {
                placeholder = queriedPlacehoders[j];
                var selector = placeholder.getAttribute("select")
                var matching = element.querySelectorAll(selector)
                docfrag = document.createDocumentFragment();
                var toAppend = [].slice.call(matching.childNodes);
                for (k = 0; k < toAppend.length; k++) {
                    docfrag.appendChild(toAppend[k])
                }
                placeholder.parentNode.insertBefore(docfrag.cloneNode(true), placeholder);
                placeholder.parentNode.removeChild(placeholder);
            }
        }
        if (element.childNodes.length > 0) {
            for (i = 0; i < $template.length; i++) {
                el = $template[i]
                var contentPlaceholders = el.getElementsByTagName('content')
                if (!contentPlaceholders.length) continue;
                placeholder = contentPlaceholders[0];
                docfrag = document.createDocumentFragment();
                var toAppend = [].slice.call(element.childNodes);
                for (j = 0; j < toAppend.length; j++) {
                    docfrag.appendChild(toAppend[j])
                }
                var parentNode = placeholder.parentNode;
                parentNode.insertBefore(docfrag.cloneNode(true), placeholder);
                parentNode.removeChild(placeholder);
                break;
            }
        }
        // if there is remaining custom-element content detach it
        if (element.childNodes.length > 0) {
            var remaining = $(element.childNodes)
            remaining.detach();
            this.$detachedContent = remaining;
        }
        docfrag = document.createDocumentFragment();
        $template = [].slice.call($template);
        for (i = 0; i < $template.length; i++) {
            docfrag.appendChild($template[i])
        }
        element.appendChild(docfrag.cloneNode(true))
    }
}

module.exports = ComponentService;