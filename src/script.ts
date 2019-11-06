import { cssAttributes } from './cssAttributes';
declare const WANTED_WIDTH = 800;

export class Counter {
    map: { [key: string]: number } = {};

    increase(element: HTMLElement) {
        if (element.tagName in this.map) {
            this.map[element.tagName] = this.map[element.tagName] + 1;
        }
        else {
            this.map[element.tagName] = 1;
        }
        return this.map[element.tagName];
    };
}

export function getText(node: Node): string | null {
    var firstNode = node.childNodes[0];
    if (firstNode && firstNode.nodeType == node.TEXT_NODE) {
        return firstNode.nodeValue;
    }
    if (node.nodeType == node.TEXT_NODE) {
        return node.nodeValue;
    }
    return "";
}

export function getX(node: Element): number {
    var rect = node.getBoundingClientRect();
    return rect.left + window.scrollX;
}

export function getY(node: Element): number {
    var rect = node.getBoundingClientRect();
    return rect.top + window.scrollY;
}

function getFullWidth():number {
    const clientWidth = window.document.documentElement.clientWidth;
    const bodyScrollWidth = window.document.body ? window.document.body.scrollWidth : 0;
    const documentScrollWidth =  window.document.documentElement.scrollWidth;
    const bodyOffsetWidth = window.document.body ? window.document.body.offsetWidth : 0;
    const documentOffsetWidth = window.document.documentElement.offsetWidth;
    return Math.max(clientWidth, bodyScrollWidth, documentScrollWidth, bodyOffsetWidth, documentOffsetWidth);
}

export function addCoordinates(extractedAttributes: { [key: string]: any }, node: Element): void {
    const fullWidth = getFullWidth();
    // these attributes need special treatment
    extractedAttributes["absolute-x"] = getX(node) * (WANTED_WIDTH / fullWidth);
    extractedAttributes["absolute-y"] = getY(node) * (WANTED_WIDTH / fullWidth);
    extractedAttributes["absolute-width"] = node.getBoundingClientRect().width * (WANTED_WIDTH / fullWidth);
    extractedAttributes["absolute-height"] = node.getBoundingClientRect().height * (WANTED_WIDTH / fullWidth);
    let parentNode = <Element>node.parentNode;
    if (typeof parentNode.getBoundingClientRect === "function") {
        extractedAttributes["x"] = getX(node) - getX(parentNode);
        extractedAttributes["y"] = getY(node) - getY(parentNode);
        extractedAttributes["width"] = node.getBoundingClientRect().width - parentNode.getBoundingClientRect().width;
        extractedAttributes["height"] = node.getBoundingClientRect().height - parentNode.getBoundingClientRect().height;
    }
    else {
        extractedAttributes["x"] = getX(node);
        extractedAttributes["y"] = getY(node);
        extractedAttributes["width"] = node.getBoundingClientRect().width;
        extractedAttributes["height"] = node.getBoundingClientRect().height;
    }
}

export function isDisabled(node: any): boolean {
    if (!node.disabled) {
        return false;
    }
    if (node.disabled === "") {
        return false;
    }
    if (node.disabled === "disabled") {
        return true;
    }
    return node.disabled ? true : false;
}

//extract *given* CSS style attributes
export function getComputedStyleSafely(node: Element): {[k: string]: any} {
    try {
        return window.getComputedStyle(node) || {};
    } catch (err) {}
    return {};
}

export function transform(node: any):  { [key: string]: any } {
    var extractedAttributes: {[k: string]: any} = {
        "tagName": <string>node.tagName.toLowerCase(),
        "text": <string>getText(node),
        "value": <string>node.value,
        "tab-index": <number>node.tabIndex,
        "shown": <boolean>isShown(node)
    };
    if (node.nodeType == node.TEXT_NODE) {
        addCoordinates(extractedAttributes, <Element>node.parentNode);
        return extractedAttributes;
    }
    // extract *all* HTML element attributes
    var attrs = node.attributes;
    for (var i = 0; i < attrs.length; i++) {
        var attributeName = attrs[i].name;
        var attributeValue = attrs[i].value;
        extractedAttributes[attributeName] = attributeValue;
    }
    // overwrite empty attributes (e.g. 'disabled')
    extractedAttributes["checked"] = node.checked;
    extractedAttributes["disabled"] = isDisabled(<Element>node);
    extractedAttributes["read-only"] = node.readOnly;
    // extract *given* CSS style attributes
    var style: {[k: string]: any} = getComputedStyleSafely(<Element>node);
    var parentStyle: {[k: string]: any} = getComputedStyleSafely(<Element>node.parentNode);
    for (var i = 0; i < cssAttributes.length; i++) {
        var attrName = cssAttributes[i];
        if (!extractedAttributes[attrName]) {
            if (parentStyle[attrName] != style[attrName]) {
                extractedAttributes[attrName] = style[attrName];
            }
        }
    }
    addCoordinates(extractedAttributes, node);
    return extractedAttributes;
}

export function isShown(e: any): boolean {
    if (e.nodeType == e.TEXT_NODE) {
        return isShown(<Element>e.parentNode);
    }
    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

export function isNonEmptyTextNode(node: Node): boolean {
    var nodeValue = (node.nodeValue == null) ? "" : node.nodeValue;
    return node.nodeType == node.TEXT_NODE && nodeValue.trim().length > 0;
}

export function containsOtherElements(element: HTMLElement): boolean {
    return element.children.length > 0;
}

export function getElementXPath(node: Node|null): string {
    var paths = [];
    for ( ; node && node.nodeType == Node.ELEMENT_NODE; node = node.parentNode)  {
        var index = 0;
        for (var sibling = node.previousSibling; sibling; sibling = sibling.previousSibling) {
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) {
                continue;
            }

            if (sibling.nodeName == node.nodeName) {
                ++index;
            }
        }
        var tagName = node.nodeName.toLowerCase();
        var pathIndex = "[" + (index+1) + "]";
        paths.unshift(tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join( "/") : "";
}

export function mapElement(element: HTMLElement, parentPath: string, allElements: {[k: string]: any}):  {[k: string]: any} {
    if (!element || !element.children) {
        return allElements;
    }
    var counter = new Counter();
    for (var i = 0; i < element.childNodes.length; i++) {
        var child: {[k: string]: any} = element.childNodes[i];
        if (child.nodeType == child.ELEMENT_NODE ||
            (isNonEmptyTextNode(<HTMLElement>child) && containsOtherElements(element))) {
            if (child.nodeType == child.TEXT_NODE) {
                child.tagName = "textnode";
            }
            var cnt = counter.increase(<HTMLElement>child);
            var path = parentPath + "/" + child.tagName.toLowerCase() + "[" + cnt + "]";
            allElements[path] = transform(<HTMLElement>child);
            mapElement(<HTMLElement>child, path, allElements);
        }
    }
    return allElements;
}

export function getAllElementsByXPath(node: any): {[k: string]: any} {
	var rootNode = document.getElementsByTagName("html")[0];
	var rootPath = "//html[1]";
	if (node) {
	    rootNode = node;
	    rootPath = getElementXPath(rootNode);
	}
	var root = transform(rootNode);
	var allElements: {[k: string]: any} = {};
	allElements[rootPath] = root;
	allElements = mapElement(rootNode, rootPath, allElements);
	return allElements;
}
