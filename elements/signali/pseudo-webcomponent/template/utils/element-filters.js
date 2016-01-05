import matchesSelector from "skatejs/src/util/matches-selector"
const slice = Array.prototype.slice;

const NODE_TYPE_ELEMENT = Node.ELEMENT_NODE;
const NODE_TYPE_TEXT = Node.TEXT_NODE;


export function nodeMatchSelector(node, selector, exclude = false) {
    if (node.nodeType != NODE_TYPE_ELEMENT) return exclude;
    var matches = matchesSelector(node, selector);
    return exclude ? !matches : matches;
}


export default {

    onlyMatching (elements, selector) {
        return elements.filter(node => nodeMatchSelector(node, selector))
    },

    excludeMatching (elements, selector) {
        return elements.filter(node => nodeMatchSelector(node, selector, true))
    },

    /**
     * Removes nodes from the start and end of the passed collection
     * stopping at elements or non-empty text-nodes
     *
     * @param elements Collection of nodes to be trimmed
     * @returns {Array}
     */
    trimVirtual (elements) {
        var i, from, to;
        var shouldIgnore = function(node) {
            if (node.nodeType == NODE_TYPE_ELEMENT) return false;
            if (node.nodeType == NODE_TYPE_TEXT && !/^\s*$/g.test(node.nodeValue)) {
                return false;
            }
            return true;
        }
        for (i = 0; i < elements.length; i++) {
            from = i;
            if (!shouldIgnore(elements[i])) break;
        }
        for (i = elements.length-1; i > -1; i--) {
            if (!shouldIgnore(elements[i])) break;
            to = i;
        }
        return slice.call(elements).slice(from, to)
    }
}