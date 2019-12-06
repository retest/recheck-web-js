import { getComputedStyleSafely } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import 'jsdom-global/register';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { window } = new JSDOM(`
    <html>
      <head><style>#id1 .clazz { margin-left: 100px; }</style></head>
      <body>
        <div></div>
        <div id="id1"><span class="clazz"></span></div>
      </body>
    </html>
  `);

describe('getComputedStyleSafely', () => {
  it('should return empty object for non exist element', () => {
    const el = window.document.getElementsByTagName('p')[0];
    const result = getComputedStyleSafely(el);
    expect(result.constructor === Object && Object.entries(result).length === 0).to.equal(true);
  });

  it('should return default style for exist element', () => {
    const el = window.document.getElementsByTagName('div')[0];
    const result = getComputedStyleSafely(el);
    expect(result.display).to.equal('block');
  });

  it('should return applied inline style', () => {
    var document = window.document;
    var style = document.createElement('style');
    style.innerHTML = 'p { display: none; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    var p = document.createElement('p');
    document.body.appendChild(p);
    const el = document.getElementsByTagName('p')[0];
    const result = getComputedStyleSafely(el);
    expect(result.display, 'none');
  });

  it('should return applied style from embedded sheet', () => {
    var el = window.document.getElementsByTagName('span')[0];
    const result = getComputedStyleSafely(el);
    expect(result.marginLeft, '100px');
  });
});
