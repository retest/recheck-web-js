import { hasAutofocus } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><button autofocus></button><input />`);

describe('hasAutofocus', () => {
  it('should return true if element has autofocus attr', () => {
    const node = dom.window.document.querySelector('button');
    const result = hasAutofocus(node);
    expect(result).to.equal(true);
  });

  it("should return false if element doesn't have autofocus attr", () => {
    const node = dom.window.document.createElement('input');
    const result = hasAutofocus(node);
    expect(result).to.equal(false);
  });
});
