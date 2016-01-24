import {nodeMatchSelector} from "./utils/element-filters";
const NodeList = window.NodeList;
const slice = [].slice;
const TEXT_NODE = Node.TEXT_NODE;

export default class ContentContainer {
    nodes = [];

    constructor(placeholder) {
        this.placeholder = placeholder;
        this.selector = placeholder.getAttribute('select');
    }

    isSpecific() {
        return typeof this.selector == 'string';
    }

    append(el) {
        if (el instanceof NodeList || Array.isArray(el)) {
            slice.call(el).map(this.append.bind(this));
            return;
        }
        if (this.isSpecific() && !nodeMatchSelector(el, this.selector)) {
            return false;
        }
        if (el.nodeType == TEXT_NODE && el.textContent == '') {
            return false
        }
        this.nodes.push(el);
        this.placeholder.parentNode.insertBefore(el, this.placeholder);
        return true;
    }

    clear() {
        this.nodes.map(node => {
            node.parentNode.removeChild(node)
        });
        this.nodes = []
    }

    replaceWith(el) {
        this.clear();
        this.append(el)
    }
}

export function appendChild (waitingToBeAppended) {
    var contentTags = this.__templateContentTags;
    if (!contentTags) return;

    /* PARSE <content select=".."> tags */
    var specificContentTags = contentTags['specific'];
    for (let i = 0, contentTag; i < specificContentTags.length; i++) {
        contentTag = specificContentTags[i];
        if (contentTag.append(waitingToBeAppended)) return;
    }

    /* PARSE <content> tags if we haven't appended the content yet */
    var broadContentTags = contentTags['generic'];
    if (broadContentTags.length) {
        broadContentTags[0].append(waitingToBeAppended);
        return;
    }

    this.insertBefore(waitingToBeAppended, this.lastChild);
}

export function clearContent() {
    this.__templateContentTags.specific.map(tag => tag.clear());
    this.__templateContentTags.generic.map(tag => tag.clear())
}