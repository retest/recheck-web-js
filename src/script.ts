import { cssAttributes } from './cssAttributes';

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
  return rect.left + window.scrollX;
}

export function getY(node: Element): number {
  const rect = node.getBoundingClientRect();
  return rect.top + window.scrollY;
}

function getFullWidth(): number {
  const clientWidth = window.document.documentElement.clientWidth;
  const bodyScrollWidth = window.document.body ? window.document.body.scrollWidth : 0;
  const documentScrollWidth = window.document.documentElement.scrollWidth;
  const bodyOffsetWidth = window.document.body ? window.document.body.offsetWidth : 0;
  const documentOffsetWidth = window.document.documentElement.offsetWidth;
  return Math.max(clientWidth, bodyScrollWidth, documentScrollWidth, bodyOffsetWidth, documentOffsetWidth);
}

export function addCoordinates(extractedAttributes: { [key: string]: any }, node: Element): void {
  const fullWidth = getFullWidth();
  // these attributes need special treatment
  extractedAttributes['absolute-x'] = getX(node);
  extractedAttributes['absolute-y'] = getY(node);
  extractedAttributes['absolute-width'] = node.getBoundingClientRect().width;
  extractedAttributes['absolute-height'] = node.getBoundingClientRect().height;
  const parentNode = node.parentNode as Element;
  if (typeof parentNode.getBoundingClientRect === 'function') {
    extractedAttributes['x'] = getX(node) - getX(parentNode);
    extractedAttributes['y'] = getY(node) - getY(parentNode);
    extractedAttributes['width'] = node.getBoundingClientRect().width - parentNode.getBoundingClientRect().width;
    extractedAttributes['height'] = node.getBoundingClientRect().height - parentNode.getBoundingClientRect().height;
  } else {
    extractedAttributes['x'] = getX(node);
    extractedAttributes['y'] = getY(node);
    extractedAttributes['width'] = node.getBoundingClientRect().width;
    extractedAttributes['height'] = node.getBoundingClientRect().height;
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

//extract *given* CSS style attributes
export function getComputedStyleSafely(node: Element|null): { [k: string]: any } {
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

export function transform(node: any): { [key: string]: any } {
  const extractedAttributes: { [k: string]: any } = {
    tagName: node.tagName.toLowerCase() as string,
    text: getText(node) as string,
    value: node.value as string,
    'tab-index': node.tabIndex as number,
    shown: isShown(node) as boolean,
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
    extractedAttributes[attributeName] = attributeValue;
  }
  // overwrite empty attributes (e.g. 'disabled')
  extractedAttributes['checked'] = node.checked;
  extractedAttributes['disabled'] = isDisabled(node as Element);
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

export function isNonEmptyTextNode(node: Node): boolean {
  const nodeValue = node.nodeValue === null ? '' : node.nodeValue;
  return node.nodeType === node.TEXT_NODE && nodeValue.trim().length > 0;
}

export function containsOtherElements(element: HTMLElement): boolean {
  return element.children.length > 0;
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

export function getAllElementsByXPath(node: any): { [k: string]: any } {
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
