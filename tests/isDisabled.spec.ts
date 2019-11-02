import { isDisabled } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><button disabled></button><input disabled="disabled" />`);
 
describe('isDisabled', () => {
 
  it('should return true if element has disabled attr', () => {
    var node = dom.window.document.querySelector("button");
    const result = isDisabled(node);
    expect(result).to.equal(true);
  });

  it('should return true if element has disabled attr with value "disabled"', () => {
    var node = dom.window.document.querySelector("input");
    const result = isDisabled(node);
    expect(result).to.equal(true);
  });

  it('should return false if element hasnt disabled attr', () => {
    var node = dom.window.document.createElement("input");
    const result = isDisabled(node);
    expect(result).to.equal(false);
  });
 
});