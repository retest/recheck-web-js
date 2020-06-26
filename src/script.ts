import cssAttributes from './cssAttributes';

export class Counter {
  map: { [key: string]: number } = {};

  increase(element: HTMLElement): number {
    if (element.tagName in this.map) {
      this.map[element.tagName] = this.map[element.tagName] + 1;
    } else {
      this.map[element.tagName] = 1;
    }
    return this.map[element.tagName];
  }
}

interface ExportedAttributes {
  [key: string]: string | number | boolean | undefined;
}

export default function getAllElementsByXPath(node: any): { [k: string]: any } {
  let rootNode = document.getElementsByTagName('html')[0];
  let rootPath = '//html[1]';
  if (node) {
    rootNode = node;
    rootPath = getElementXPath(rootNode);
  }
  const root = transform(rootNode);
  let allElements: { [k: string]: any } = {};
  allElements[rootPath] = root;
  allElements = mapElement(rootNode, rootPath, allElements);
  return allElements;
}

export function getElementXPath(node: Node | null): string {
  const paths = [];
  for (; node && node.nodeType === Node.ELEMENT_NODE; node = node.parentNode) {
    let index = 0;
    for (let sibling = node.previousSibling; sibling; sibling = sibling.previousSibling) {
      if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
        continue;
      }

      if (sibling.nodeName === node.nodeName) {
        ++index;
      }
    }
    const tagName = node.nodeName.toLowerCase();
    const pathIndex = '[' + (index + 1) + ']';
    paths.unshift(tagName + pathIndex);
  }

  return paths.length ? '/' + paths.join('/') : '';
}

export function mapElement(
  element: HTMLElement,
  parentPath: string,
  allElements: { [k: string]: any },
): { [k: string]: any } {
  if (!element || !element.children) {
    return allElements;
  }
  const counter = new Counter();
  for (let i = 0; i < element.childNodes.length; i++) {
    const child: { [k: string]: any } = element.childNodes[i];
    if (
      child.nodeType === child.ELEMENT_NODE ||
      (isNonEmptyTextNode(child as HTMLElement) && containsOtherElements(element))
    ) {
      if (child.nodeType === child.TEXT_NODE) {
        child.tagName = 'textnode';
      }
      const cnt = counter.increase(child as HTMLElement);
      const path = parentPath + '/' + child.tagName.toLowerCase() + '[' + cnt + ']';
      allElements[path] = transform(child as HTMLElement);
      mapElement(child as HTMLElement, path, allElements);
    }
  }
  return allElements;
}

export function transform(node: any): { [key: string]: any } {
  const extractedAttributes: ExportedAttributes = {
    tagName: node.tagName.toLowerCase() as string,
    text: getText(node) as string,
    value: node.value as string,
    tabindex: node.tabIndex as number,
    shown: isShown(node) as boolean,
    covered: isCovered(node) as boolean,
  };
  if (node.nodeType === node.TEXT_NODE) {
    addCoordinates(extractedAttributes, node.parentNode as Element);
    return extractedAttributes;
  }
  // extract *all* HTML element attributes
  const attrs = node.attributes;
  for (let i = 0; i < attrs.length; i++) {
    const attributeName = attrs[i].name;
    const attributeValue = attrs[i].value;
    if (attributeValue != undefined && attributeValue != '' && attributeValue != 'null') {
      extractedAttributes[attributeName] = attributeValue;
    }
  }
  // overwrite empty attributes (e.g. 'disabled')
  extractedAttributes['checked'] = node.checked;
  extractedAttributes['disabled'] = isDisabled(node as Element);
  extractedAttributes['autofocus'] = hasAutofocus(node as Element);
  extractedAttributes['read-only'] = node.readOnly;
  // extract *given* CSS style attributes
  const style: { [k: string]: any } = getComputedStyleSafely(node as Element);
  const parentStyle: { [k: string]: any } = getComputedStyleSafely(node.parentNode as Element);
  for (let i = 0; i < cssAttributes.length; i++) {
    const attrName = cssAttributes[i];
    if (!extractedAttributes[attrName]) {
      if (parentStyle[attrName] != style[attrName]) {
        extractedAttributes[attrName] = style[attrName];
      }
    }
  }
  addCoordinates(extractedAttributes, node);
  return extractedAttributes;
}

export function getText(node: Node): string | null {
  const firstNode = node.childNodes[0];
  if (firstNode && firstNode.nodeType === node.TEXT_NODE) {
    return firstNode.nodeValue;
  }
  if (node.nodeType === node.TEXT_NODE) {
    return node.nodeValue;
  }
  return '';
}

export function getX(node: Element): number {
  const rect = node.getBoundingClientRect();

  // Internet Explorer does not support scrollX, but provides the non-standard pageXOffset
  if (window.scrollX === undefined && window.pageXOffset) {
    return rect.left + window.pageXOffset;
  }

  return rect.left + window.scrollX;
}

export function getY(node: Element): number {
  const rect = node.getBoundingClientRect();

  // Internet Explorer does not support scrollY, but provides the non-standard pageYOffset
  if (window.scrollY === undefined && window.pageYOffset) {
    return rect.top + window.pageYOffset;
  }

  return rect.top + window.scrollY;
}

export function getWidth(node: Element): number {
  if (node.getBoundingClientRect().width) {
    return node.getBoundingClientRect().width;
  }
  return node.clientWidth;
}

export function getHeight(node: Element): number {
  if (node.getBoundingClientRect().height) {
    return node.getBoundingClientRect().height;
  }
  return node.clientHeight;
}

export function addCoordinates(attributes: ExportedAttributes, node: Element): void {
  // these attributes need special treatment
  attributes['absolute-x'] = getX(node);
  attributes['absolute-y'] = getY(node);
  attributes['absolute-width'] = getWidth(node);
  attributes['absolute-height'] = getHeight(node);
  const parentNode = node.parentNode as Element;
  if (typeof parentNode.getBoundingClientRect === 'function') {
    attributes['x'] = getX(node) - getX(parentNode);
    attributes['y'] = getY(node) - getY(parentNode);
    attributes['width'] = getWidth(node) - getWidth(parentNode);
    attributes['height'] = getHeight(node) - getHeight(parentNode);
  } else {
    attributes['x'] = getX(node);
    attributes['y'] = getY(node);
    attributes['width'] = getWidth(node);
    attributes['height'] = getHeight(node);
  }
}

export function isDisabled(node: any): boolean {
  if (!node.disabled) {
    return false;
  }
  if (node.disabled === '') {
    return false;
  }
  if (node.disabled === 'disabled') {
    return true;
  }
  return node.disabled ? true : false;
}

export function hasAutofocus(node: any): boolean {
  if (!node.autofocus) {
    return false;
  }
  if (node.autofocus === '') {
    return false;
  }
  if (node.autofocus === 'autofocus') {
    return true;
  }
  return node.autofocus;
}

// check if element is behind another one
export function isCovered(node: any): boolean {
  const BOUNDING_PRECISION = 1;

  // TODO Handle false negatives for elements outside of viewport
  if (typeof node.getBoundingClientRect === 'function' && document.elementFromPoint != undefined) {
    const boundingRect = node.getBoundingClientRect();

    const top = document.elementFromPoint(
      boundingRect.left + boundingRect.width / 2,
      boundingRect.top + BOUNDING_PRECISION,
    );
    const bottom = document.elementFromPoint(
      boundingRect.left + boundingRect.width / 2,
      boundingRect.bottom - BOUNDING_PRECISION,
    );
    const left = document.elementFromPoint(
      boundingRect.left + BOUNDING_PRECISION,
      boundingRect.top + boundingRect.height / 2,
    );
    const right = document.elementFromPoint(
      boundingRect.right - BOUNDING_PRECISION,
      boundingRect.top + boundingRect.height / 2,
    );

    if (
      top != null &&
      !node.contains(top) &&
      bottom != null &&
      !node.contains(bottom) &&
      left != null &&
      !node.contains(left) &&
      right != null &&
      !node.contains(right)
    ) {
      return true;
    }
  }

  return false;
}

//extract *given* CSS style attributes
export function getComputedStyleSafely(node: Element | null): { [k: string]: any } {
  if (node === null) {
    return {};
  }
  try {
    return window.getComputedStyle(node) || {};
  } catch (err) {}
  return {};
}

export function isShown(e: any): boolean {
  if (e.nodeType === e.TEXT_NODE) {
    return isShown(e.parentNode as Element);
  }
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

export function isNonEmptyTextNode(node: Node): boolean {
  const nodeValue = node.nodeValue === null ? '' : node.nodeValue;
  return node.nodeType === node.TEXT_NODE && nodeValue.trim().length > 0;
}

export function containsOtherElements(element: HTMLElement): boolean {
  return element.children.length > 0;
}
