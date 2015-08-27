require('skatejs/dist/skatejs');
var attrTypeDef = require('skatejs-type-attribute/lib');
var $ = require('jquery');
var EventEmitter = require('eventemitter3');

function ComponentService() {
    EventEmitter.call(this);
    this.registered = {};
    this.attributeElementsSetCallbacks = {};
}
ComponentService.prototype = Object.create(EventEmitter.prototype);
ComponentService.prototype.constructor = ComponentService;

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
        if (elementType == 'attribute' && options.properties && options.properties[name].set) {
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
    service.registered[name] = {};
    if (options && options.properties) {
        service.registered[name].customPropertyNames = Object.keys(options.properties);
    }
    service.emit('register', name, service.registered[name])
    skate(name, definition);
};
ComponentService.prototype.addAttributeElementSetCallback = function (name, callback) {
    this.attributeElementsSetCallbacks[name].push(callback)
};
ComponentService.prototype.upgrade = function (el) {
    skate.init(el)
};
ComponentService.prototype.has = function (name) {
    return name in this.registered;
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
ComponentService.componentDefaults = {};

function matchesSelector(el, selector) {
    var matchesSelector = el.matches || el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
    return matchesSelector.call(el, selector);
}

function findMatchingChildren(el, selector) {
    var matching = [];
    for (var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if (node.nodeType != Node.ELEMENT_NODE)  continue;
        if (matchesSelector(node, selector)) matching.push(node);
    }
    return matching;
}

function getElementTemplateData(el, options) {
    var data = $.extend({}, options.include);
    for (var i = 0; i < el.attributes.length; i++) {
        var attr = el.attributes[i];
        data[attr.name] = attr.value == '' ? true : attr.value;
    }
    if (options.properties) {
        for (prop in options.properties) {
            if (!options.properties.hasOwnProperty(prop)) continue;
            data[prop] = el[prop]
        }
    }
    return data;
}

function makeTemplate(options) {
    return function () {
        var element = this;

        /* PARSE custom template with data */
        var templateData = getElementTemplateData(element, options);
        var templateFragment = $(options.template(templateData))[0].parentNode;

        var node, i, j, k, placeholder, toAppend, parentNode;
        /* PARSE <content select=".."> tags */
        for (i = 0; i < templateFragment.childNodes.length; i++) {
            node = templateFragment.childNodes[i];
            if (node.nodeType != Node.ELEMENT_NODE)  continue;
            if (node.tagName == 'CONTENT' && node.hasAttribute('select')) {
                queriedPlaceholders = [node];
            } else {
                var queriedPlaceholders = [].slice.call(node.querySelectorAll('content[select]'));
            }
            for (j = 0; j < queriedPlaceholders.length; j++) {
                placeholder = queriedPlaceholders[j];
                var selector = placeholder.getAttribute("select");
                toAppend = findMatchingChildren(element, selector);
                parentNode = placeholder.parentNode;
                for (k = 0; k < toAppend.length; k++) {
                    parentNode.insertBefore(toAppend[k], placeholder);
                }
                parentNode.removeChild(placeholder)
            }
        }

        /* PARSE <content> tags if element has any content remaining */
        if (element.childNodes.length > 0) {
            for (i = 0; i < templateFragment.childNodes.length; i++) {
                node = templateFragment.childNodes[i];
                if (node.nodeType != Node.ELEMENT_NODE) continue;
                if (node.tagName == 'CONTENT' && !node.hasAttribute('select')) {
                    contentPlaceholders = [node];
                } else {
                    var contentPlaceholders = [].slice.call(node.querySelectorAll('content:not([select])'));
                }
                if (!contentPlaceholders.length) continue;
                placeholder = contentPlaceholders[0];
                parentNode = placeholder.parentNode;
                toAppend = [].slice.call(element.childNodes);
                for (j = 0; j < toAppend.length; j++) {
                    parentNode.insertBefore(toAppend[j], placeholder);
                }
                parentNode.removeChild(placeholder);
                break;
            }
        }

        /* Detach any remaining content from the custom element */
        if (element.childNodes.length > 0) {
            var remaining = $(element.childNodes);
            remaining.detach();
            element.$detachedContent = remaining;
        }

        /* APPEND the template to the element */
        var nodes = [];
        for (i = 0; i < templateFragment.childNodes.length; i++) {
            nodes.push(templateFragment.childNodes[i])
        }
        for (i = 0; i < nodes.length; i++) {
            Node.prototype.appendChild.call(element, nodes[i])
        }
    }
}

module.exports = ComponentService;