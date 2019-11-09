import { containsOtherElements } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div><p>Hello world</p></div>`);

describe('containsOtherElements', () => {
  it('should return true for element with children', () => {
    const node = dom.window.document.querySelector('div');
    const result = containsOtherElements(<HTMLElement>node);
    expect(result).to.equal(true);
  });

  it('should return false for element without children', () => {
    const node = dom.window.document.querySelector('p');
    const result = containsOtherElements(<HTMLElement>node);
    expect(result).to.equal(false);
  });
});
