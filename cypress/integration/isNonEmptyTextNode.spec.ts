import { isNonEmptyTextNode } from '../../src/script';

describe('isNonEmptyTextNode', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return true if element contain text', () => {
    cy.document().then(doc => {
      const node = document.createTextNode('Hello world');
      const result = isNonEmptyTextNode(node);
      expect(result).to.equal(true);
    });
  });

  it('should return false if element without text', () => {
    cy.document().then(doc => {
      const node = document.createTextNode('');
      const result = isNonEmptyTextNode(node);
      expect(result).to.equal(false);
    });
  });

  it('should return false if element is empty', () => {
    cy.document().then(doc => {
      const node = document.createElement('div');
      const result = isNonEmptyTextNode(node);
      expect(result).to.equal(false);
    });
  });
});
