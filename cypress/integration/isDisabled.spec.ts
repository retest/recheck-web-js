import { isDisabled } from '../../src/script';

describe('isDisabled', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return true if element has disabled attr', () => {
    cy.document().then(doc => {
      const node = doc.querySelector('button');
      const result = isDisabled(node);
      expect(result).to.equal(true);
    });
  });

  it('should return true if element has disabled attr with value "disabled"', () => {
    cy.document().then(doc => {
      const node = doc.querySelector('input');
      const result = isDisabled(node);
      expect(result).to.equal(true);
    });
  });

  it('should return false if element hasnt disabled attr', () => {
    cy.document().then(doc => {
      const node = doc.createElement('input');
      const result = isDisabled(node);
      expect(result).to.equal(false);
    });
  });
});
