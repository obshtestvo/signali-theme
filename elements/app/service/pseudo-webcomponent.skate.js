require('skatejs/dist/skatejs');
var $ = require('jquery');

function ComponentService() {
    this.registered = [];
    this.callbacksPerAttribute = {};
}
ComponentService.prototype.register = function (name, options) {
    var service = this;
    if (service.has(name) && (!options.type || (options.type && options.type == 'element'))) {
        throw Error("Component with the same name already exists");
    }
    var definition = {};
    if (options) {
        options = service._transformOptionsForSkate(options);
        // the following block is needed because Skate.js doesn't allow registering 2 different behaviours for
        // custom attributes with the same name
        if (options.type == skate.type.ATTRIBUTE) {
            if (!service.callbacksPerAttribute.hasOwnProperty(name)) {
                service.callbacksPerAttribute[name] = [];
                service.addAttributeCallback(name, options.attribute);
                var attrName = name;
                options.attribute = function(name, oldValue, newValue) {
                    var el = this;
                    service.callbacksPerAttribute[attrName].forEach(function(callback) {
                        callback.call(el, name, oldValue, newValue)
                    })
                }
            } else {
                service.addAttributeCallback(name, options.attribute);
                return
            }
        }
        definition = $.extend({}, ComponentService.componentDefaults, options)
    }
    service.registered.push(name);
    skate(name, definition);
};
ComponentService.prototype.addAttributeCallback = function (name, callback) {
    this.callbacksPerAttribute[name].push(callback)
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
        element.setAttribute('shadeid', shadeid);
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
                queriedPlaceholders = [node];
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
                    contentPlaceholders = [node];
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
                parentNode.removeChild(placeholder);
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