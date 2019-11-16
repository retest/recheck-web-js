import { getElementXPath } from '../../src/script';

describe('getElementXPath', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });
  
  it('should return correct xpath for first element', () => {
    cy.document().then(doc => {
      const el = doc.getElementsByTagName('div')[0];
      const result = getElementXPath(<Node>el);
      expect(result).to.equal('/html[1]/body[1]/div[1]');
    });
  });

  it('should return correct xpath for second element', () => {
    cy.document().then(doc => {
      const el = doc.getElementById('id1');
      const result = getElementXPath(<Node>el);
      expect(result).to.equal('/html[1]/body[1]/div[2]');
    });
  });

  it('should return empty string for non-exist element', () => {
    cy.document().then(doc => {
      const el = doc.getElementById('id3');
      const result = getElementXPath(<Node>el);
      expect(result).to.equal('');
    });
  });
});
