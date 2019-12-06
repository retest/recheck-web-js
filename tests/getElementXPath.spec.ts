import { getElementXPath } from '../src/script';
import { expect } from 'chai';
import 'mocha';
import 'jsdom-global/register';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { window } = new JSDOM(`
    <html>
      <head></head>
      <body>
        <div></div>
        <div id="id1"><span class="clazz"></span></div>
      </body>
    </html>
  `);

describe('getElementXPath', () => {
  it('should return correct xpath for first element', () => {
    const el = window.document.getElementsByTagName('div')[0];
    const result = getElementXPath(<Node>el);
    expect(result).to.equal('/html[1]/body[1]/div[1]');
  });

  it('should return correct xpath for second element', () => {
    const el = window.document.getElementById('id1');
    const result = getElementXPath(<Node>el);
    expect(result).to.equal('/html[1]/body[1]/div[2]');
  });

  it('should return empty string for non-exist element', () => {
    const el = window.document.getElementById('id3');
    const result = getElementXPath(<Node>el);
    expect(result).to.equal('');
  });
});
