import skate from 'skatejs/src';
import attrTypeDef from 'skatejs-types/src/attribute';
import EventEmitter from 'eventemitter3';
import pseudoShadowDomRender from './template';
import debounce from 'lodash.debounce';
import {
    appendChild as appendToShadowTemplateElement,
    clearContent
} from './template/content';

const slice = [].slice;

class ComponentService extends EventEmitter {

    static componentDefaults = {};

    /**
     * Init
     */
    constructor () {
        super();
        this.registered = {};
        this.attributeElementsSetCallbacks = {};
        this.debouncedRenderEnd = debounce(() => this.emit('domRendered'), 500);
    }

    /**
     * Apply handy modifications to the underlying library
     * @param name {String}
     * @param definition {Object|Class}
     */
    register (definition = {}) {
        var name = definition.displayName;
        slice.call(document.getElementsByTagName(name)).map(node => {
            node.__initialOuterHTML = node.outerHTML;
            node.clone = function() {
                var clone = skate.fragment(node.__initialOuterHTML);
                return clone.childNodes[0];
            }
        });
        if (this.has(name) && (!definition.type || definition.type == 'element')) {
            throw Error('Component with the same name already exists');
        }
        var elementType = definition.type,
            props = definition.properties;

        definition = this._transformOptionsForSkate(definition);
        // the following block is needed because Skate.js doesn't allow registering 2 different behaviours for
        // custom attributes with the same name
        if (elementType == 'attribute' && props && props[name] && props[name].set) {
            if (this.enableCustomAttributesWithSameName(name, definition)) return;
        }
        // apply any defaults that hasn't been overridden
        for (let prop in ComponentService.componentDefaults) {
            if (definition.hasOwnProperty(prop)) continue;
            definition[prop] = ComponentService.componentDefaults[prop]
        }
        this.registered[name] = definition;
        this.emit('register', name, this.registered[name]);
    }

    parse () {
        for (let name in this.registered) {
            skate(name, this.registered[name])
        }
    }

    /**
     *
     * @param name
     * @param definition
     * @returns {boolean}
     */
    enableCustomAttributesWithSameName (name, definition) {
        var service = this;
        if (!service.attributeElementsSetCallbacks.hasOwnProperty(name)) {
            service.attributeElementsSetCallbacks[name] = [];
            service.attributeElementsSetCallbacks[name].push(definition.properties[name].set);
            definition.properties[name].set = function(element, propData) {
                service.attributeElementsSetCallbacks[name].map(callback => {
                    callback.call(this, element, propData)
                })
            };
            definition.properties[name].attribute = true;
            return false;
        } else {
            service.attributeElementsSetCallbacks[name].push(definition.properties[name].set);
            return true;
        }
    }

    /**
     * Wrapper of underlying library for forcing init of custom element behaviour
     * @param el
     */
    upgrade (el) {
        skate.init(el)
    }

    /**
     * Check if element is already registered
     * @param name {String}
     * @returns {boolean}
     */
    has (name) {
        return name in this.registered;
    }

    _transformOptionsForSkate (definition) {
        var self = this;
        if (definition.template) {
            definition = Object.assign(definition, {
                render (element) {
                    pseudoShadowDomRender(element, definition);
                    self.debouncedRenderEnd();
                }
            });
            // the following block is making appendChild magic and ability to clear content tags
            definition.prototype.appendChild = appendToShadowTemplateElement;
            definition.prototype.clearContent = clearContent;
        }
        if (definition.created) {
            var originalCreated = definition.created;
        }
        definition.created = function(element) {
            element.componentService = self;
            if (!element.clone) element.clone = element.cloneNode;
            if (originalCreated) originalCreated.call(this, element)
        };
        if (definition.type) {
            if (definition.type == 'element') {
                delete definition['type'];
            } else {
                var types = {
                    'attribute': attrTypeDef
                };
                definition.type = types[definition.type]
            }
        }
        return definition
    }
}

export default ComponentService;