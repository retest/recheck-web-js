import { getText } from '../../src/script';

describe('getText', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return empty string for parent element', () => {
    cy.document().then(doc => {
      const node = doc.querySelector('.clazz');
      const result = getText(<HTMLElement>node);
      expect(result).to.equal('');
    });
  });

  it('should return the same text as in child text element', () => {
    cy.document().then(doc => {
      const node = doc.querySelector('p');
      const result = getText(<HTMLElement>node);
      expect(result).to.equal('Hello world');
    });
  });

  it('should return empty string from empty element', () => {
    cy.document().then(doc => {
      const node = doc.createElement('p');
      const result = getText(node);
      expect(result).to.equal('');
    });
  });
});
