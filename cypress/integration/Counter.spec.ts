import { Counter } from '../../src/script';

describe('Counter', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return right count paragraphs', () => {
    cy.window().then(win => {
      const blockEl = win.document.createElement('div');
      const firstParagraph = win.document.createElement('p');
      const secondParagraph = win.document.createElement('p');
      const counter = new Counter();
      let result = counter.increase(<HTMLElement>firstParagraph);
      result = counter.increase(<HTMLElement>blockEl);
      result = counter.increase(<HTMLElement>secondParagraph);
      expect(result).to.equal(2);
    });
  });

  it('should return right count for last added element', () => {
    cy.window().then(win => {
      const blockEl = win.document.createElement('div');
      const firstParagraph = win.document.createElement('p');
      const secondParagraph = win.document.createElement('p');
      const counter = new Counter();
      let result = counter.increase(<HTMLElement>firstParagraph);
      result = counter.increase(<HTMLElement>secondParagraph);
      result = counter.increase(<HTMLElement>blockEl);
      expect(result).to.equal(1);
    });
  });
});
