import { Counter } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div></div>`);
 
describe('Counter', () => {
 
  it('should return right count paragraphs', () => {
    var blockEl = dom.window.document.createElement("div");
    var firstParagraph = dom.window.document.createElement("p");
    var secondParagraph = dom.window.document.createElement("p");
    var counter = new Counter();
    var result = counter.increase(<HTMLElement>firstParagraph);
    result = counter.increase(<HTMLElement>blockEl);
    result = counter.increase(<HTMLElement>secondParagraph);
    expect(result).to.equal(2);
  });
 
  it('should return right count for last added element', () => {
    var blockEl = dom.window.document.createElement("div");
    var firstParagraph = dom.window.document.createElement("p");
    var secondParagraph = dom.window.document.createElement("p");
    var counter = new Counter();
    var result = counter.increase(<HTMLElement>firstParagraph);
    result = counter.increase(<HTMLElement>secondParagraph);
    result = counter.increase(<HTMLElement>blockEl);
    expect(result).to.equal(1);
  });

});