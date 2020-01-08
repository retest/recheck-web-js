import getAllElementsByXPath from '../src/script';
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

describe('getAllElementsByXPath', () => {
  it('should return correct xpath for first element', () => {
    const el = window.document.getElementsByTagName('div')[0];
    const result = getAllElementsByXPath(<Node>el);
    expect(!!result['/html[1]/body[1]/div[1]']).to.equal(true);
    expect(result['/html[1]/body[1]/div[1]'].tagName).to.equal('div');
    expect(Object.entries(result).length).to.equal(1);
  });

  it('should return element by id with child', () => {
    const el = window.document.getElementById('id1');
    const result = getAllElementsByXPath(<Node>el);
    expect(!!result['/html[1]/body[1]/div[2]']).to.equal(true);
    expect(result['/html[1]/body[1]/div[2]'].id).to.equal('id1');
    expect(!!result['/html[1]/body[1]/div[2]/span[1]']).to.equal(true);
    expect(result['/html[1]/body[1]/div[2]/span[1]'].tagName).to.equal('span');
    expect(Object.entries(result).length).to.equal(2);
  });

  it('should return object with root elements', () => {
    const el = window.document.getElementById('id3');
    const result = getAllElementsByXPath(<Node>el);
    expect(!!result['//html[1]']).to.equal(true);
    expect(!!result['//html[1]/head[1]']).to.equal(true);
    expect(!!result['//html[1]/head[1]/meta[1]']).to.equal(true);
    expect(!!result['//html[1]/body[1]']).to.equal(true);
    expect(Object.entries(result).length).to.equal(4);
  });
});
