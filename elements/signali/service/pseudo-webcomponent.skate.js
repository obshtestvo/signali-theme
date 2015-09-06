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
        if (options.prototype && elementType == 'attribute') {
            var originalCreated = options.created;
            var attachPrototype = function() {
                for (var method in options.prototype) {
                    if (!options.prototype.hasOwnProperty(method)) continue;
                    this[method] = options.prototype[method]
                }
            };
            if (originalCreated) {
                options.created = function() {
                    attachPrototype.call(this)
                    originalCreated.call(this)
                }
            } else {
                options.created = attachPrototype
            }
        }
        options = service._transformOptionsForSkate(options);
        // the following block is needed because Skate.js doesn't allow registering 2 different behaviours for
        // custom attributes with the same name
        var props = options.properties;
        if (elementType == 'attribute' && props && props[name] && props[name].set) {
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
        // the following block is making appendChild magic
        if (elementType != 'attribute') {
            if (!options.prototype) options.prototype = {};
            options.prototype.appendChild = appendToShadowTemplateElement
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

function filterElements(elements, selector, exclude) {
    var matching = [];
    for (var i = 0; i <elements.length; i++) {
        var node = elements[i];
        if (node.nodeType != Node.ELEMENT_NODE)  continue;
        if (matchesSelector(node, selector)) {
            if (!exclude) {
                matching.push(node);
            }
        } else if (exclude) {
            matching.push(node);
        }
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
        for (var prop in options.properties) {
            if (!options.properties.hasOwnProperty(prop)) continue;
            if (!options.properties[prop].get) continue;
            if (data.hasOwnProperty(prop)) continue;
            data[prop] = el[prop]
        }
    }
    return data;
}

function appendToShadowTemplateElement(waitingToBeAppended) {
    var i, placeholder, selector, shadeid, contentTags;
    shadeid = this.getAttribute('shadeid');
    contentTags = [].slice.call(this.querySelectorAll('content[shadeid="'+shadeid+'"]'));
    /* PARSE <content select=".."> tags */
    var specificContentTags = filterElements(contentTags, '[select]');
    for (i = 0; i < specificContentTags.length; i++) {
        placeholder = specificContentTags[i];
        selector = placeholder.getAttribute("select");
        if (matchesSelector(waitingToBeAppended, selector)) {
            placeholder.parentNode.insertBefore(waitingToBeAppended, placeholder);
            return;
        }
    }

    /* PARSE <content> tags if we haven't appended the content yet */
    var broadContentTags = filterElements(contentTags, '[select]', true);
    if (broadContentTags.length) {
        broadContentTags[0].parentNode.insertBefore(waitingToBeAppended, broadContentTags[0]);
        return;
    }
    this.insertBefore(waitingToBeAppended, this.lastChild);
}

function makeTemplate(options) {
    return function () {
        var element = this;
        var shadeid = 'shade-' + Math.floor(Math.random() * 1000) + '-' + Date.now();
        element.setAttribute('shadeid', shadeid);

        /* PARSE custom template with data */
        var templateData = getElementTemplateData(element, options);
        var $template = $(options.template(templateData));
        if (!$template.length)  return;

        var i, j, placeholder, toAppend, parentNode, selector, templateFragment, contentTags;

        templateFragment = $template[0].parentNode;
        contentTags = [].slice.call(templateFragment.querySelectorAll('content'));

        for (i = 0; i < contentTags.length; i++) {
            contentTags[i].setAttribute('shadeid', shadeid)
        }

        /* PARSE <content select=".."> tags */
        var specificContentTags = filterElements(contentTags, '[select]');
        for (i = 0; i < specificContentTags.length; i++) {
            placeholder = specificContentTags[i];
            selector = placeholder.getAttribute("select");
            toAppend = filterElements(element.childNodes, selector);
            parentNode = placeholder.parentNode;
            for (j = 0; j < toAppend.length; j++) {
                parentNode.insertBefore(toAppend[j], placeholder);
            }
        }

        /* PARSE <content> tags if element has any content remaining */
        var broadContentTags = filterElements(contentTags, '[select]', true);
        if (element.childNodes.length > 0 && broadContentTags.length > 0) {
            placeholder = broadContentTags[0];
            parentNode = placeholder.parentNode;
            toAppend = [].slice.call(element.childNodes);
            for (j = 0; j < toAppend.length; j++) {
                parentNode.insertBefore(toAppend[j], placeholder);
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