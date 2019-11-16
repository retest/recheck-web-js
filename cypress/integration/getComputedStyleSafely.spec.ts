import { getComputedStyleSafely } from '../../src/script';

describe('getComputedStyleSafely', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return empty object for non exist element', () => {
    cy.document().then(doc => {
      const el = doc.getElementsByTagName('textarea')[0];
      const result = getComputedStyleSafely(el);
      expect(result.constructor === Object && Object.entries(result).length === 0).to.equal(true);
    });
  });

  it('should return default style for exist element', () => {
    cy.document().then(doc => {
      const el = doc.getElementsByTagName('div')[0];
      const result = getComputedStyleSafely(el);
      expect(result.display).to.equal('block');
    });
  });

  it('should return applied inline style', () => {
    cy.document().then(doc => {
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
  });

  it('should return applied style from embedded sheet', () => {
    cy.document().then(doc => {
      var el = doc.getElementsByTagName('span')[0];
      const result = getComputedStyleSafely(el);
      expect(result.marginLeft, '100px');
    });
  });
});
