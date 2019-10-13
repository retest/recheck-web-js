import {getText, mapElement} from '../src/script';
import { expect } from 'chai';
import 'mocha';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`...`)).window;
 
describe('First test', () => {
 
  it('should return true', () => {
    var node = document.createTextNode("This is new.");
    const result = getText(node);
    expect(result).to.equal("This is new.");
  });
 
});