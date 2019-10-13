"use strict";
import * as cssAttributes from './cssAttributes.json';

export class Counter {
    map: Array<string>
    constructor() {
        this.map = []
    }

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

export function addCoordinates(extractedAttributes: Array<any>, node: Element): void {
    // these attributes need special treatment
    extractedAttributes["absolute-x"] = getX(node) * (WANTED_WIDTH / fullWidth);
    extractedAttributes["absolute-y"] = getY(node) * (WANTED_WIDTH / fullWidth);
    extractedAttributes["absolute-width"] = node.getBoundingClientRect().width * (WANTED_WIDTH / fullWidth);
    extractedAttributes["absolute-height"] = node.getBoundingClientRect().height * (WANTED_WIDTH / fullWidth);
    if (typeof node.parentNode.getBoundingClientRect === "export function") {
        extractedAttributes["x"] = getX(node) - getX(node.parentNode);
        extractedAttributes["y"] = getY(node) - getY(node.parentNode);
        extractedAttributes["width"] = node.getBoundingClientRect().width - node.parentNode.getBoundingClientRect().width;
        extractedAttributes["height"] = node.getBoundingClientRect().height - node.parentNode.getBoundingClientRect().height;
    }
    else {
        extractedAttributes["x"] = getX(node);
        extractedAttributes["y"] = getY(node);
        extractedAttributes["width"] = node.getBoundingClientRect().width;
        extractedAttributes["height"] = node.getBoundingClientRect().height;
    }
}

export function isDisabled(node: HTMLElement | HTMLSelectElement): boolean {
    if (!node.disabled) {
        return false;
    }
    if (node.disabled === "") {
        return false;
    }
    if (node.disabled === "disabled") {
        return true;
    }
    return node.disabled;
}

export function transform(node: Node): Array<any> {
    var extractedAttributes = {
        "tagName": node.tagName.toLowerCase(),
        "text": getText(node),
        "value": node.value,
        "tab-index": node.tabIndex,
        "shown": isShown(node)
    };
    if (node.nodeType == node.TEXT_NODE) {
        addCoordinates(extractedAttributes, node.parentNode);
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
    extractedAttributes["disabled"] = isDisabled(node);
    extractedAttributes["read-only"] = node.readOnly;
    // extract *given* CSS style attributes
    var style = window.getComputedStyle(node);
    var parentStyle = [];
    try {
        parentStyle = window.getComputedStyle(node.parentNode);
    }
    catch (err) { }
    for (var i = 0; i < cssAttributes.length; i++) {
        var attributeName = cssAttributes[i];
        if (!extractedAttributes[attributeName]) {
            if (parentStyle[attributeName] != style[attributeName]) {
                extractedAttributes[attributeName] = style[attributeName];
            }
        }
    }
    addCoordinates(extractedAttributes, node);
    return extractedAttributes;
}

export function isShown(e: Node | HTMLElement | Element): boolean {
    if (e.nodeType == e.TEXT_NODE) {
        return isShown(e.parentNode);
    }
    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

export function isNonEmptyTextNode(node: Node): boolean {
    return node.nodeType == node.TEXT_NODE && node.nodeValue.trim().length > 0;
}

export function containsOtherElements(element: HTMLElement): boolean {
    return element.children.length > 0;
}

export function mapElement(element: HTMLElement, parentPath: string, allElements: Array<HTMLElement>): Array<HTMLElement> {
    if (!element || !element.children) {
        return allElements;
    }
    var counter = new Counter();
    for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i];
        if (child.nodeType == child.ELEMENT_NODE ||
            (isNonEmptyTextNode(child) && containsOtherElements(element))) {
            if (child.nodeType == child.TEXT_NODE) {
                child.tagName = "textnode";
            }
            var cnt = counter.increase(child);
            var path = parentPath + "/" + child.tagName.toLowerCase() + "[" + cnt + "]";
            allElements[path] = transform(child);
            mapElement(child, path, allElements);
        }
    }
    return allElements;
}