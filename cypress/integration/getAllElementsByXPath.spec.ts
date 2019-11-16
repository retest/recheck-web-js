import { getAllElementsByXPath } from '../../src/script';

describe('getAllElementsByXPath', () => {
  beforeEach(() => {
    cy.server();
    cy.route('**/fake.html', 'fixture:fake.html');
    cy.visit('cypress/fixtures/fake.html');
  });

  it('should return correct xpath for first element', () => {
    cy.document().then(doc => {
      const el = doc.getElementsByTagName('div')[0];
      const result = getAllElementsByXPath(<Node>el);
      expect(!!result['/html[1]/body[1]/div[1]']).to.equal(true);
      expect(result['/html[1]/body[1]/div[1]'].tagName).to.equal('div');
      expect(Object.entries(result).length).to.equal(2);
    });
  });

  it('should return element by id with child', () => {
    cy.document().then(doc => {
      const el = doc.getElementById('id1');
      const result = getAllElementsByXPath(<Node>el);
      expect(!!result['/html[1]/body[1]/div[2]']).to.equal(true);
      expect(result['/html[1]/body[1]/div[2]'].id).to.equal('id1');
      expect(!!result['/html[1]/body[1]/div[2]/span[1]']).to.equal(true);
      expect(result['/html[1]/body[1]/div[2]/span[1]'].tagName).to.equal('span');
      expect(Object.entries(result).length).to.equal(2);
    });
  });

  it('should return object with root elements', () => {
    cy.document().then(doc => {
      const el = doc.getElementById('id3');
      const result = getAllElementsByXPath(<Node>el);
      console.log(result);
      expect(!!result['//html[1]']).to.equal(true);
      expect(!!result['//html[1]/head[1]']).to.equal(true);
      expect(!!result['//html[1]/head[1]/meta[1]']).to.equal(true);
      expect(!!result['//html[1]/body[1]']).to.equal(true);
    });
  });
});
