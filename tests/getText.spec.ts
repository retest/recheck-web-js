import { getText } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div><p>Hello world</p></div>`);
 
describe('getText', () => {
 
  it('should return empty string for parent element', () => {
    var node = dom.window.document.querySelector("div");
    const result = getText(<HTMLElement>node);
    expect(result).to.equal("");
  });

  it('should return the same text as in child text element', () => {
    var node = dom.window.document.querySelector("p");
    const result = getText(<HTMLElement>node);
    expect(result).to.equal("Hello world");
  });

  it('should return empty string from empty element', () => {
    var node = dom.window.document.createElement("p");
    const result = getText(node);
    expect(result).to.equal("");
  });
 
});