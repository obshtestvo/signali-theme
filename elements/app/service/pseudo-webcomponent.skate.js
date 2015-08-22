require('skatejs/dist/skatejs');
var attrTypeDef = require('skatejs-type-attribute/lib');
var $ = require('jquery');

function ComponentService() {
    this.registered = [];
    this.attributeElementsSetCallbacks = {};
}
ComponentService.prototype.register = function (name, options) {
    var service = this;
    if (service.has(name) && (!options.type || (options.type && options.type == 'element'))) {
        throw Error("Component with the same name already exists");
    }
    var definition = {};
    if (options) {
        var elementType = options.type;
        options = service._transformOptionsForSkate(options);
        // the following block is needed because Skate.js doesn't allow registering 2 different behaviours for
        // custom attributes with the same name
        if (elementType == 'attribute' && options.properties[name].set) {
            if (!service.attributeElementsSetCallbacks.hasOwnProperty(name)) {
                service.attributeElementsSetCallbacks[name] = [];
                service.addAttributeElementSetCallback(name, options.properties[name].set);
                var attrName = name;
                options.properties[name].set = function(newValue, oldValue) {
                    var el = this;
                    service.attributeElementsSetCallbacks[attrName].forEach(function(callback) {
                        callback.call(el, newValue, oldValue)
                    })
                }
                options.properties[name].attr = true;
            } else {
                service.addAttributeElementSetCallback(name, options.properties[name].set);
                return
            }
        }
        definition = $.extend({}, ComponentService.componentDefaults, options)
    }
    service.registered.push(name);
    skate(name, definition);
};
ComponentService.prototype.addAttributeElementSetCallback = function (name, callback) {
    this.attributeElementsSetCallbacks[name].push(callback)
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
        if (o.type == 'element') {
            delete o['type'];
        } else {
            var types = {
                "attribute": attrTypeDef,
            };
            o.type = types[o.type]
        }
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
        if (options.properties) {
            for (prop in options.properties) {
                if (!options.properties.hasOwnProperty(prop)) continue;
                data[prop] = element[prop]
            }
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
    }
}

module.exports = ComponentService;