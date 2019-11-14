import { containsOtherElements } from '../../src/script';

describe('containsOtherElements', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return true for element with children', () => {
    cy.window().then(win => {
      const node = win.document.querySelector('div');
      const result = containsOtherElements(<HTMLElement>node);
      expect(result).to.equal(true);
    });
  });

  it('should return false for element without children', () => {
    cy.window().then(win => {
      const node = win.document.querySelector('p');
      const result = containsOtherElements(<HTMLElement>node);
      expect(result).to.equal(false);
    });
  });
});
