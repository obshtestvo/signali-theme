import fragmentFromString from './utils/fragment-from-string';
import fragmentFromCollection from './utils/fragment-from-collection';
import ContentContainer from './content';

const slice = [].slice;

function getElementTemplateData(el, options) {
    var data = Object.assign({}, options.include);
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

export default function render (element, options) {
    /* PARSE custom template with data */
    var templateData = getElementTemplateData(element, options);
    templateFragment = fragmentFromString(options.template(templateData));
    if (!templateFragment.childNodes.length) return;
    var templateFragment, contentTags = {specific:[], generic:[]};

    slice.call(templateFragment.querySelectorAll('content')).map(tag => {
        tag = new ContentContainer(tag);
        if (tag.isSpecific()) {
            contentTags.specific.push(tag);
        } else {
            contentTags.generic.push(tag);
        }
    });
    element.__templateContentTags = contentTags;

    /* PARSE <content select=".."> tags */
    var specificContentTags = contentTags.specific;
    specificContentTags.map(tag => tag.append(element.childNodes));

    /* PARSE <content> tags if element has any content remaining */
    var broadContentTags = contentTags.generic;
    if (element.childNodes.length > 0 && broadContentTags.length > 0) {
        contentTags.generic[0].append(element.childNodes);
    }

    /* Detach any remaining content from the custom element */
    if (element.childNodes.length > 0) {
        element.detachedContent = fragmentFromCollection(element.childNodes).childNodes;
    }

    /* APPEND the template to the element */
    slice.call(templateFragment.childNodes).map(node => {
        Node.prototype.appendChild.call(element, node)
    })
}