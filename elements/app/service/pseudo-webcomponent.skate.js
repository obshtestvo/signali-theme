require('skatejs/dist/skatejs');
var $ = require('jquery');

function ComponentService() {
    this.registered = [];
}
ComponentService.prototype.register = function (name, options) {
    if (this.has('name')) throw Error("Component with the same name already exists");
    var definition = {};
    if (options) {
        options = this._transformOptionsForSkate(options);
        definition = $.extend({}, ComponentService.componentDefaults, options)
    }
    this.registered.push(name);
    skate(name, definition);
};
ComponentService.prototype.has = function (name) {
    return this.registered.indexOf(name) > -1;
};
ComponentService.prototype._transformOptionsForSkate = function (o) {
    if (o.template) {
        o = $.extend({}, o, {
            template: makeTemplate(o)
        });
    }
    if (o.type) {
        var types = {
            "attribute": skate.type.ATTRIBUTE,
            "element": skate.type.ELEMENT,
            "class": skate.type.CLASSNAME
        };
        o.type = types[o.type]
    }
    return o
};
ComponentService.componentDefaults = {
    publish: []
};

function makeTemplate(options) {
    return function () {
        var element = this;
        var parent = element.parentNode;
        var shadeid = 'shade-' + Math.floor(Math.random() * 1000) + '-' + Date.now();
        var qyueryPrefix = '[shadeid="'+shadeid+'"] > ';
        element.setAttribute('shadeid', shadeid)
        var data = $.extend({}, options.include);
        for (var a = 0; a < element.attributes.length; a++) {
            var attr = element.attributes[a];
            data[attr.name] = attr.value == '' ? true : attr.value;
        }
        var $template = $(options.template(data));
        var node, i, j, k, placeholder, toAppend, parentNode, nodes = [], isDirect;
        for (i = 0; i < $template.length; i++) {
            node = $template[i];
            isDirect = false;
            if (node.nodeType != Node.ELEMENT_NODE) {
                nodes.push(node);
                continue;
            }
            if (node.tagName == 'CONTENT' && node.hasAttribute('select')) {
                queriedPlaceholders = [node]
                isDirect = true;
            } else {
                var queriedPlaceholders = [].slice.call(node.querySelectorAll('content[select]'));
                nodes.push(node)
            }
            for (j = 0; j < queriedPlaceholders.length; j++) {
                placeholder = queriedPlaceholders[j];
                var selector = placeholder.getAttribute("select");
                var matching = parent.querySelectorAll(qyueryPrefix + selector);
                toAppend = [].slice.call(matching);
                parentNode = placeholder.parentNode;
                for (k = 0; k < toAppend.length; k++) {
                    parentNode.insertBefore(toAppend[k], placeholder);
                    if (isDirect) {
                        nodes.push(toAppend[k])
                    }
                }
                parentNode.removeChild(placeholder)
            }
        }
        if (element.childNodes.length > 0) {
            for (i = 0; i < nodes.length; i++) {
                node = $template[i];
                isDirect = false;
                if (node.nodeType != Node.ELEMENT_NODE) continue;
                if (node.tagName == 'CONTENT' && !node.hasAttribute('select')) {
                    contentPlaceholders = [node]
                    isDirect = true;
                } else {
                    var contentPlaceholders = [].slice.call(node.querySelectorAll('content:not([select])'));
                }
                if (!contentPlaceholders.length) continue;
                placeholder = contentPlaceholders[0];
                parentNode = placeholder.parentNode;
                toAppend = [].slice.call(element.childNodes);
                for (j = 0; j < toAppend.length; j++) {
                    parentNode.insertBefore(toAppend[j], placeholder);
                    if (isDirect) {
                        nodes.push(toAppend[j])
                    }
                }
                parentNode.removeChild(placeholder)
                break;
            }
        }
        // if there is remaining custom-element content detach it
        if (element.childNodes.length > 0) {
            var remaining = $(element.childNodes);
            remaining.detach();
            element.$detachedContent = remaining;
        }
        for (i = 0; i < nodes.length; i++) {
            element.appendChild(nodes[i])
        }
        console.log(this.tagName)
    }
}

module.exports = ComponentService;