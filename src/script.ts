declare var WANTED_WIDTH: number;
declare var fullWidth: number;

var cssAttributes: string[] = [
    "align-content",
    "align-items",
    "align-self",
    "all",
    "animation-name",
    "animation-duration",
    "animation-timing-function",
    "animation-delay",
    "animation-iteration-count",
    "animation-direction",
    "animation-fill-mode",
    "animation-play-state",
    "backface-visibility",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size",
    "border-bottom-style",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-width",
    "border-collapse",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "bottom",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "color",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "content",
    "counter-increment",
    "counter-reset",
    "direction",
    "display",
    "empty-cells",
    "filter",
    "flex-basis",
    "flex-direction",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "font-family",
    "font-size",
    "line-height",
    "text-align",
    "text-indent",
    "float",
    "font-kerning",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column-end",
    "grid-column-start",
    "grid-row-end",
    "grid-row-start",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "grid-row-gap",
    "grid-column-gap",
    "hanging-punctuation",
    "hyphens",
    "isolation",
    "justify-content",
    "left",
    "letter-spacing",
    "line-height",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "mix-blend-mode",
    "object-fit",
    "object-position",
    "opacity",
    "order",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow-x",
    "overflow-y",
    "offsetHeight",
    "offsetWidth",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "perspective",
    "pointer-events",
    "position",
    "quotes",
    "resize",
    "right",
    "scroll-behavior",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-last",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-style",
    "text-indent",
    "text-justify",
    "text-overflow",
    "text-shadow",
    "text-transform",
    "top",
    "transform",
    "transform-style",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "unicode-bidi",
    "user-select",
    "vertical-align",
    "visibility",
    "white-space",
    "word-break",
    "word-spacing",
    "word-wrap",
    "z-index"
]

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

export function addCoordinates(extractedAttributes: { [key: string]: any }, node: Element): void {
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