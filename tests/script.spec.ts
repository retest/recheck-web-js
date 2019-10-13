import getElementByPath from '../src/script';
import { expect } from 'chai';
import 'mocha';
 
describe('First test', () => {
 
  it('should return true', () => {
    var node = document.createTextNode("This is new.");
    const result = getElementByPath.getText(node);
    expect(result).to.equal("This is new.");
  });
 
});